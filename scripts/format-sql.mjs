import { deparse, parse } from 'pgsql-parser';
import path, { dirname } from 'path';
import { fileURLToPath } from 'url';

import chalk from 'chalk';
import fs from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

function snakeCaseToPascalCase(str) {
  return str.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function snakeCaseToCamelCase(str) {
  return str.split('_').map((word, index) => index === 0 ? word : word.charAt(0).toUpperCase() + word.slice(1)).join('');
}

function unQuote(str) {
  // Check if the string is already double-quoted
  if (str.startsWith('"') && str.endsWith('"')) {
    return str.slice(1, -1);
  }

  return str;
}

function doubleQuote(str) {
  return `"${unQuote(str)}"`;
}

function format(directory) {
  // Get all the sql files in the directory
  const files = [];

  fs.readdirSync(directory).forEach(file => {
    const filePath = path.join(directory, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      format(filePath);
    } else if (stat.isFile() && file.endsWith('.sql')) {
      files.push(filePath);
    }
  });

// ----------------------- Utils -------------------------

  function findCreateStmtIdx(statements, tableName) {
    return statements.findIndex(stmt => {
      if (!stmt.RawStmt.stmt.hasOwnProperty('CreateStmt')) {
        return false;
      }

      const { CreateStmt } = stmt.RawStmt.stmt;
      const { relation } = CreateStmt;

      return relation.relname === tableName;
    });
  }

  function resolveDependencies(statements, chain, statement) {
    statement.rank += 1;

    const { CreateStmt } = statement.RawStmt.stmt;

    for (let j = 0; j < CreateStmt.tableElts.length; j++) {
      const elt = CreateStmt.tableElts[j];

      if (!elt.hasOwnProperty('Constraint') || elt.Constraint.contype !== 'CONSTR_FOREIGN') {
        continue;
      }

      // If it's self-referencing, skip it
      if (elt.Constraint.pktable.relname === CreateStmt.relation.relname) {
        continue;
      }

      // Find the index of the "create" statement for the referenced table
      const dependencyIndex = findCreateStmtIdx(statements, elt.Constraint.pktable.relname);

      if (dependencyIndex === -1) {
        continue;
      }

      const dependency = statements[dependencyIndex];

      statement.dependencies.add(dependency);

      dependency.rank += 1;

      if (chain.has(dependency)) {
        chain.add(dependency);
        // console.log(
        //   chalk.whiteBright.bold(CreateStmt.relation.relname),
        //   `${chalk.yellowBright.bold(`(`)}${chalk.blueBright.bold(statement.rank)}${chalk.yellowBright.bold(`)`)}`,
        //   chalk.redBright.bold('<-->'),
        //   chalk.whiteBright.bold(dependency.RawStmt.stmt.CreateStmt.relation.relname),
        //   `${chalk.yellowBright.bold(`(`)}${chalk.blueBright.bold(dependency.rank)}${chalk.yellowBright.bold(`)`)}`,
        // );
        continue;
      }

      // console.log(
      //   chalk.whiteBright.bold(CreateStmt.relation.relname),
      //   `${chalk.yellowBright.bold(`(`)}${chalk.blueBright.bold(statement.rank)}${chalk.yellowBright.bold(`)`)}`,
      //   chalk.greenBright.bold('->'),
      //   chalk.whiteBright.bold(dependency.RawStmt.stmt.CreateStmt.relation.relname),
      //   `${chalk.yellowBright.bold(`(`)}${chalk.blueBright.bold(dependency.rank)}${chalk.yellowBright.bold(`)`)}`,
      // );

      chain.add(dependency);
      resolveDependencies(statements, chain, dependency);
    }

    statement.resolved = true;
  }

  // Read each file and format it
  for (const file of files) {
    // ------------------------ Parse ------------------------

    const sql = fs.readFileSync(file, 'utf8');

    // Parse the file
    let statements = parse(sql)
      .map(statement => {
        Object.defineProperty(statement, 'dependencies', { enumerable: false, value: new Set() });
        Object.defineProperty(statement, 'resolved', { enumerable: false, value: false, writable: true });
        Object.defineProperty(statement, 'rank', { enumerable: false, value: 0, writable: true });

        return statement;
      });

    // ----------------------- Format -----------------------

    statements = statements.map((statement) => {
      const { stmt } = statement.RawStmt;

      if (!stmt.hasOwnProperty('AlterTableStmt')) {
        return statement;
      }

      const { AlterTableStmt } = stmt;
      const addConstraint = AlterTableStmt.cmds.find(cmd => cmd.AlterTableCmd.subtype === 'AT_AddConstraint');

      if (!addConstraint) {
        return statement;
      }

      const createStmtIdx = findCreateStmtIdx(statements, AlterTableStmt.relation.relname);

      if (createStmtIdx === -1) {
        return statement;
      }

      const { CreateStmt } = statements[createStmtIdx].RawStmt.stmt;

      CreateStmt.tableElts.push(addConstraint.AlterTableCmd.def);

      return null;
    }).filter(statement => statement !== null);

    // Resolve dependencies
    for (const statement of statements) {
      const { stmt } = statement.RawStmt;

      if (stmt.hasOwnProperty('CreateEnumStmt')) {
        statement.rank = Number.MAX_SAFE_INTEGER;
        continue;
      }

      if (stmt.hasOwnProperty('IndexStmt')) {
        statement.rank = 0;
        continue;
      }

      if (!stmt.hasOwnProperty('CreateStmt')) {
        continue;
      }

      if (statement.resolved) {
        continue;
      }

      const chain = new Set();
      chain.add(statement);

      // console.log(
      //   chalk.greenBright.bold('->'),
      //   chalk.whiteBright.bold(statement.RawStmt.stmt.CreateStmt.relation.relname),
      //   `${chalk.yellowBright.bold(`(`)}${chalk.blueBright.bold(statement.rank)}${chalk.yellowBright.bold(`)`)}`,
      // );

      resolveDependencies(statements, chain, statement);
    }

    // Sort the statements by rank (Highest to lowest)
    statements = statements.sort((a, b) => b.rank - a.rank);

    for (const statement of statements) {
      const { stmt } = statement.RawStmt;

      if (stmt.hasOwnProperty('CreateStmt')) {
        // This is a "create table" statement

        const { relation } = stmt.CreateStmt;

        // console.log(
        //   chalk.whiteBright.bold(relation.relname),
        //   `${chalk.yellowBright.bold(`(`)}${chalk.blueBright.bold(statement.rank)}${chalk.yellowBright.bold(`)`)}`,
        // );

        // Convert the table name to PascalCase
        relation.relname = snakeCaseToPascalCase(relation.relname);

        for (const elt of stmt.CreateStmt.tableElts) {
          if (elt.hasOwnProperty('ColumnDef')) {
            // This is a column definition

            // Convert the column names to camelCase
            const { colname } = elt.ColumnDef;
            elt.ColumnDef.colname = snakeCaseToCamelCase(colname);
          }

          if (elt.hasOwnProperty('Constraint')) {
            // This is a constraint definition

            const { contype } = elt.Constraint;

            if (contype === 'CONSTR_PRIMARY') {
              // Convert the column name in constraint to camelCase
              for (const key of elt.Constraint.keys) {
                key.String.str = snakeCaseToCamelCase(key.String.str);
              }

              elt.Constraint.conname = doubleQuote(`${unQuote(relation.relname)}_pkey`);
            }

            if (contype === 'CONSTR_FOREIGN') {
              // Convert the column name in constraint to camelCase
              for (const key of elt.Constraint.fk_attrs) {
                key.String.str = snakeCaseToCamelCase(key.String.str);
              }

              for (const key of elt.Constraint.pk_attrs) {
                key.String.str = snakeCaseToCamelCase(key.String.str);
              }

              // Convert the table name in constraint to PascalCase
              elt.Constraint.pktable.relname = snakeCaseToPascalCase(elt.Constraint.pktable.relname);

              const keys = elt.Constraint.fk_attrs.map(key => unQuote(key.String.str));

              elt.Constraint.conname = doubleQuote(`${unQuote(relation.relname)}_${keys.join('_')}_fkey`);
            }
          }
        }

        continue;
      }

      if (stmt.hasOwnProperty('IndexStmt')) {
        // This is a "create index" statement

        // Convert the table name to PascalCase
        stmt.IndexStmt.relation.relname = snakeCaseToPascalCase(stmt.IndexStmt.relation.relname);

        // Convert the column names to camelCase
        for (const key of stmt.IndexStmt.indexParams) {
          key.IndexElem.name = `"${snakeCaseToCamelCase(key.IndexElem.name)}"`;
        }

        const suffix = stmt.IndexStmt.unique ? 'key' : 'idx';

        const keys = stmt.IndexStmt.indexParams.map(key => unQuote(key.IndexElem.name));

        stmt.IndexStmt.idxname = doubleQuote(`${unQuote(stmt.IndexStmt.relation.relname)}_${keys.join('_')}_${suffix}`);
      }
    }

    // ----------------------- Write ------------------------

    // Get the parent directory name
    const parentDir = path.basename(path.dirname(file));

    // Write the file
    fs.writeFileSync(file, deparse(statements), 'utf8');

    // Log the file name in blue bold and a check mark in green at the end
    console.log(chalk.bold(chalk.blue(`${parentDir}/${path.basename(file)}`)) + chalk.green(' ✓'));
  }
}

export function run(api, website) {
  if (api) {
    format(path.resolve(__dirname, '../api/prisma/migrations'));
  }

  if (website) {
    format(path.resolve(__dirname, '../website/prisma/migrations'));
  }

  if (!api && !website) {
    format(path.resolve(__dirname, '../api/prisma/migrations'));
    format(path.resolve(__dirname, '../website/prisma/migrations'));
  }
}
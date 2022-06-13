type jsonType = {
  id: string;
  type: string;
  data: {
    text: string;
    level?: number;
    style?: string;
    caption?: string;
    items: {
      content: string;
      items: {
        content: string;
      }[];
    }[];
    file: {
      width: number;
      height: number;
      size: string;
      name: string;
      title: string;
      extension: string;
      fileId: string;
      fileURL: string;
      url: string;
    };
  };
};
export const useJsonToHtml = (json: jsonType[]) => {
  let html = '';
  json.forEach((block) => {
    switch (block.type) {
      case 'paragraph':
        html += `<p class='qmm_para'>${block['data']['text']}</p>`;
        break;
      case 'header':
        html += `<h${block['data']['level']} class='qmm_heading_${block['data']['level']}'>${block['data']['text']}</h${block['data']['level']}>`;
        break;
      case 'nestedlist':
        {
          const listing = block['data']['style'] === 'ordered' ? 'ol' : 'ul';
          html += `<${listing} class='list_${listing}'>`;
          block['data']['items'].forEach((item) => {
            html += `<li class='list_item'>${item.content}`;
            if (item.items.length > 0) {
              html += `<${listing} class='list_nested_${listing}'>`;
              item.items.forEach((item) => {
                html += `<li class='list_item'>${item.content}</li>`;
              });
              html += `</${listing}>`;
            }
            html += `</li>`;
          });
          html += `</${listing}>`;
        }
        break;
      case 'image':
        html += `<img src="${block['data']['file']['url']}" alt="${block['data']['file']['title']}" />`;
        break;
      case 'code':
        html += `<pre><code>${block['data']['code']}</code></pre>`;
        break;
      case 'quote':
        console.log(
          '🚀 ~ file: use-json-to-html.ts ~ line 63 ~ json.forEach ~ block',
          block,
        );
        html += `<figure class='qmm_figure'>`;
        html += `<blockquote class='qmm_blockquote'><p>${block['data']['text']}</p></blockquote>`;
        html += `<figcaption class='qmm_figcaption'><em>${block['data']['caption']}</em></figcaption>`;
        html += `</figure>`;
        break;
      case 'link':
        console.log(
          '🚀 ~ file: use-json-to-html.ts ~ line 67 ~ json.forEach ~ block',
          block,
        );
        html += `<a href="${block['data']['text']}" class='qmm_link'>${block['data']['text']}</a>`;
        break;
      case 'table':
        console.log(
          "🚀 ~ file: use-json-to-html.ts ~ line 72 ~ block['data']['items'].forEach ~ block",
          block,
        );
        html += `<table>`;
        block['data']['items'].forEach((row) => {
          html += `<tr>`;
          row.forEach((cell) => {
            html += `<td>${cell}</td>`;
          });
          html += `</tr>`;
        });
        html += `</table>`;
        break;
      case 'thematicBreak':
        console.log('horizontalLine');
        html += `<hr />`;
        break;
      case 'delimiter':
        html += `<hr />`;
        break;
      case 'hardBreak':
        html += `<br />`;
        break;
      case 'codeBlock':
        html += `<pre><code>${block['data']['text']}</code></pre>`;
        break;
      case 'tableCell':
        html += `<td>${block['data']['text']}</td>`;
        break;
      case 'tableRow':
        html += `<tr>`;
        block['data']['items'].forEach((cell) => {
          html += `<td>${cell}</td>`;
        });
        html += `</tr>`;
        break;
      case 'tableHeader':
        html += `<th>${block['data']['text']}</th>`;
        break;
      case 'tableHeaderRow':
        html += `<tr>`;
        block['data']['items'].forEach((cell) => {
          html += `<th>${cell}</th>`;
        });
        html += `</tr>`;
        break;
      case 'tableHeaderCell':
        html += `<th>${block['data']['text']}</th>`;
        break;
      case 'tableCellRow':
        html += `<tr>`;
        block['data']['items'].forEach((cell) => {
          html += `<td>${cell}</td>`;
        });
        html += `</tr>`;
        break;
      case 'checklist':
        html += `<ul>`;
        block['data']['items'].forEach((item) => {
          html += `<li class='list_item'>`;
          html += `<input type='checkbox' checked=${item.checked} />`;
          html += `<span>${item.text}</span>`;
          html += `</li>`;
        });
        html += `</ul>`;
        break;
      default:
        html += `<p>${block['data']['text']}</p>`;
        break;
    }
  });
  return html;
};

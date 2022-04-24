<template>
    <div class="widget widget_links">
        <h4 class="widget-title">{{ $slot }}</h4>
        <ul>
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
        </ul>
    </div>
</template>

<script>
export default {
  name: 'widget-3',
};
</script>

<style scoped>

</style>
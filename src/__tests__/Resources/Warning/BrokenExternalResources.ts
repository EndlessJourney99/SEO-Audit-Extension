const resource = /* html */ `
<html lang="en" data-user-theme="dark" class="js-focus-visible" data-js-focus-visible="">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0" name="viewport">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/regular/latin.woff2" rel="preload">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/bold/latin.woff2" rel="preload">
    <link href="https://web-dev.imgix.net" rel="preconnect">
    <meta content="#fff" name="theme-color">
    <title>It's time to lazy-load offscreen iframes!</title>
</head>

<body class="">
    <img alt="Addy Osmani 1" src="https://example.com/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 2" src="https://example.com/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 3" src="https://example.com/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 4" src="https://example.com/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 5" src="https://example.com/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 6" src="https://external.com/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 7" src="https://external.com/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 8" src="https://external.com/image/broken/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 9" src="https://external.com/image/broken/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Addy Osmani 10" src="https://external.com/image/broken/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">

    <a href="https://example.com/abc"></a>
    <a href="https://example.com/xyz"></a>
    <a href="https://external.com/valid/abc"></a>
    <a href="https://external.com/valid/xyz"></a>
    <a href="https://external.com/valid/mnb"></a>
    <a href="https://external.com/invalid/ghj"></a>
    <a href="https://external.com/invalid/ijk"></a>
    <a href=""></a>
    <a></a>
</body>
</html>`;

export default resource;

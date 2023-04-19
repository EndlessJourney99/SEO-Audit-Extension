const resource = /* html */ `<html lang="en" data-user-theme="dark" class="js-focus-visible" data-js-focus-visible="">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0" name="viewport">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/regular/latin.woff2" rel="preload">
    <link as="font" crossorigin="anonymous" href="/resources/fonts/google-sans/bold/latin.woff2" rel="preload">
    <link href="https://web-dev.imgix.net" rel="preconnect">
    <meta content="#fff" name="theme-color">
    <title>It's time to lazy-load offscreen iframes!</title>

    <link rel="stylesheet" href="/resources/style.css">
    <link rel="stylesheet" href="https://example.com/resources/style2.css">
    <link rel="stylesheet" href="https://example.com/rebase/resources/style3.css">
    <link rel="stylesheet" href="/rebase/resources/style4.css">
</head>

<body class="">
    <img alt="Test missing alt + block internal resource 1" src="https://example.com/resources/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Test missing alt + block internal resource 2" src="https://example.com/rebase/resources/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="" src="/rebase/resources/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Test missing alt + block internal resource 4" src="/resources/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img src="/resources/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt=. src="https://external.com/resources/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt=" " src="https://external.com/resources/image/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Test missing alt + block internal resource 8" src="https://external.com/resources/image/broken/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Test missing alt + block internal resource 9" src="https://external.com/resources/image/broken/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">
    <img alt="Test missing alt + block internal resource 10" src="https://external.com/resources/image/broken/1L2RBhCLSnXjCnSlevaDjy3vba73/LJyNTOzyWbowv2mrlzPS.jpeg?auto=format&amp;fit=crop&amp;h=64&amp;w=64">

    <script src="https://example.com/rebase/resources/abc.js"></script>
    <script src="https://example.com/resources/xyz.js"></script>
    <script src="https://example.com/rebase/abc.js"></script>
    <script src="/resources/abc.js"></script>
    <script src="https://external.com/resources/no.js"></script>
</body>

</html>`;

export default resource;

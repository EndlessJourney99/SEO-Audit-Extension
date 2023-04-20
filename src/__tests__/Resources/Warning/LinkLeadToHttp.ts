const resource = /* html */ `
<html lang="en" data-user-theme="dark" class="js-focus-visible" data-js-focus-visible="">

<head>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0" name="viewport">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/regular/latin.woff2" rel="preload">
    <link as="font" crossorigin="anonymous" href="/resources/fonts/google-sans/bold/latin.woff2" rel="preload">
    <link href="https://web-dev.imgix.net" rel="preconnect">
    <meta content="#fff" name="theme-color">
    <title>Link lead to http</title>
</head>

<body class="">
    <a href="https://example.com/abc" rel="nofollow"></a>
    <a rel="nofollow"></a>
    <a href=""></a>
    <a href=></a>
    <a href="http://example.com/abcd" rel="follow"></a>
    <a href="http://external.com/bbcd" rel="nofollow"></a>
</body>

</html>`;

export default resource;

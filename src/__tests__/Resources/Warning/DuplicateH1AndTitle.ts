const DuplicateH1AndTitle_Invalid = /* html */ `
<html lang="en" data-user-theme="dark" class="js-focus-visible" data-js-focus-visible="">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0" name="viewport">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/regular/latin.woff2" rel="preload">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/bold/latin.woff2" rel="preload">
    <link href="https://web-dev.imgix.net" rel="preconnect">
    <meta content="#fff" name="theme-color">
    <title>Duplicate Content</title>
</head>
<body class="">
    <h1>Duplicate Content</h1>
</body>
</html>`;

const DuplicateH1AndTitle_Valid = /* html */ `
<html lang="en" data-user-theme="dark" class="js-focus-visible" data-js-focus-visible="">
<head>
    <meta charset="utf-8">
    <meta content="width=device-width,initial-scale=1.0" name="viewport">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/regular/latin.woff2" rel="preload">
    <link as="font" crossorigin="anonymous" href="/fonts/google-sans/bold/latin.woff2" rel="preload">
    <link href="https://web-dev.imgix.net" rel="preconnect">
    <meta content="#fff" name="theme-color">
    <title>Title content</title>
</head>

<body class="">
    <h1>Difference header</h1>
</body>
</html>
`;

const Empty = ``;
export { DuplicateH1AndTitle_Invalid, DuplicateH1AndTitle_Valid, Empty };

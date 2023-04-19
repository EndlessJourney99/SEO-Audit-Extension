const FlashAndFrame_NotUsed = `
<html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Document</title>
    </head>

    <body>
        <h1>NotUse Flash Content</h1>
    </body>
</html>
`;

const FlashAndFrame_Used = /* html */ `
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Document</title>
</head>

<body>
    <h1>Use Flash Content</h1>
    <table width="100%" class="ex" cellspacing="0" border="1">
        <tr>
            <td>
                <object width="550" height="400">
                    <param name="movie" value="somefilename.swf">
                    <embed src="somefilename.swf" width="550" height="400"></embed>
                </object>
            </td>
        </tr>
    </table>
    <iframe src="https://www.w3schools.com"></iframe>
</body>

</html>
`;

export { FlashAndFrame_NotUsed, FlashAndFrame_Used };

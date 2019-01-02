<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta http-equiv="X-UA-Compatible" content="ie=edge">
	<title>{{title}}</title>
	<style>
		html, body {
			margin: 0;
			padding: 0;
		}
		a:link, a:visited, a:hover, a:active {
			color: #696969;
			text-decoration: none;
		}
		a:hover {
			font-weight: bold;
			text-decoration: underline;
		}
		.file_list {
			display: block;
			line-height: 40px;
		}

		.file_list:nth-child(odd) {
			background: #f5f7f9;
		}
	</style>
</head>
<body>
	{{#each fileList}}
		<a href="{{href}}" class="file_list">{{fileName}}</a>
	{{/each}}
</body>
</html>
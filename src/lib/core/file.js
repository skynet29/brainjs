(function() {

    function readTextFile(fileName) {
        return new Promise((resolve) => {
			var fileReader = new FileReader()

			fileReader.onload = function () {
				resolve(fileReader.result)
			}
			fileReader.readAsText(fileName)
		})
	}


	function readFileAsDataURL(fileName) {
		return new Promise((resolve) => {
			var fileReader = new FileReader()

			fileReader.onload = function () {
				resolve(fileReader.result)
			}
			fileReader.readAsDataURL(fileName)
		})
	}

	function readFile(fileName) {
		return new Promise((resolve) => {
			var fileReader = new FileReader()

			fileReader.onload = function () {
				resolve($$.url.dataURLtoBlob(fileReader.result))
			}
			fileReader.readAsDataURL(fileName)
		})

	}

	function isImage(fileName) {
		return (/\.(gif|jpg|jpeg|png)$/i).test(fileName)
	}

	function getFileType(fileName) {
		if (isImage(fileName)) {
			return 'image'
		}

		if ((/\.(ogg|mp3)$/i).test(fileName)) {
			return 'audio'
		}

		if ((/\.(mp4|webm|3gp)$/i).test(fileName)) {
			return 'video'
		}

		if ((/\.(pdf)$/i).test(fileName)) {
			return 'pdf'
		}

	}    

    $$.file = {
        readFile,
        readFileAsDataURL,
        readTextFile,
        isImage,
        getFileType
    }

})();

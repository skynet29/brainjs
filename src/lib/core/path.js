(function() {

    function getFileName(str) {
        return str.substring(str.lastIndexOf('/')+1);
    }

    function getDirName(str) {
        return str.substr(0, str.lastIndexOf('/'))
    }

    /**
     * 
     * @param {string} dirName 
     * @param {string} fileName 
     */
    function getFullPath(dirName, fileName) {
        if (dirName.endsWith('/')) {
            return dirName + fileName
        }

        return dirName + '/' + fileName
    }

    $$.path = {
        getFileName,
        getDirName,
        getFullPath
    }
})();
define(['jq', 'methods', 'URLs', 'mustache'], function ($jq, methods, URLs, Mustache) {
    var VALIDATION = {
        validateInputVal: function (obj) {
            var val = obj.val.trim();

            if (val && obj.digitsOnly) {
                val = VALIDATION.digitsOnly(val);
            }

            if (val && obj.unique) {
                val = VALIDATION.onUnique(val, obj.id);
            }

            if (!val) {
                if (obj.id) {
                    VALIDATION.showError(obj.id);
                }
                return false;
            }

            return val;
        },

        /**
         * parse string remove all letters and change coma to dot
         *
         * @param val
         * @returns {string}
         */
        digitsOnly: function (val) {
            var res;
            res = val.replace(/[^0-9.]+/g, '');
            var splitRes = res.split('.');
            res = splitRes[0];
            if (1 < splitRes.length) {
                res += '.' + splitRes[1];
            }
            return res;
        },

        onUnique: function (val, id) {
            var articles, names;
            switch (id) {
                case '#metallName':
                    names = MAIN.metallTableContent.names;
                    if (0 < names.length) {
                        val = VALIDATION.parseArray(names, val);
                    }
                    break;
                case '#metallArticle':
                    articles = MAIN.metallTableContent.articles;
                    if (0 < articles.length) {
                        val = VALIDATION.parseArray(articles, val);
                    }
                    break;
                case '#addCategoryInput':
                    names = MAIN.categoriesTableContent.names;
                    if (0 < names.length) {
                        val = VALIDATION.parseArray(names, val);
                    }
                    break;
                case '#addCategoryArticleInput':
                    articles = MAIN.categoriesTableContent.articles;
                    if (0 < articles.length) {
                        val = VALIDATION.parseArray(articles, val);
                    }
                    break;
                case '#kimHardInput':
                    articles = MAIN.categoriesTableContent.names;
                    if (0 < articles.length) {
                        val = VALIDATION.parseArray(articles, val);
                    }
                    break;
            }
            return val;
        },

        showError: function (id) {
            $(id).addClass('inputError');
            setTimeout(function(){ $(id).removeClass('inputError'); }, 1000);
        },

        parseArray: function (arr, val) {
            var i;
            var low = val.toLowerCase();
            for (i = 0; i < arr.length; i++) {
                if (low === arr[i].toLowerCase()) {
                    val = false;
                    break;
                }
            }
            return val;
        }
    };

    return VALIDATION;
});

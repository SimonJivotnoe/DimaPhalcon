define([
    'jq',
    'methods',
    'startPage',
    'dbHandler',
    'VALIDATION',
    'PRODUCT',
    'METALLS',
    'CATEGORIES',
    'KIM',
    'startPageHandler',
    'calx'
], function (
    $jq,
    methods,
    startPage,
    dbHandler,
    VALIDATION,
    PRODUCT,
    METALLS,
    CATEGORIES,
    KIM,
    startPageHandler
) {
    startPageHandler();
    var appHandler = function () {
        $jq.addCategoryBtn.click(function(){
            var category = VALIDATION.validateInputVal({
                    val: $jq.addCategoryInput.val(),
                    id: '#addCategoryInput',
                    unique: true
                }),
                article = VALIDATION.validateInputVal({
                    val: $jq.addCategoryArticleInput.val(),
                    id: '#addCategoryArticleInput',
                    unique: true
                });
            if (category && article) {
                CATEGORIES.addCategory(category, article);
            }
        });
        $jq.editCategoryBtn.click(function(){
            var name = VALIDATION.validateInputVal({
                val: $jq.editCategoryInput.val()
            });
            if (name) {
                $.when(CATEGORIES.editCategory(name)).then(function (response) {
                    if (true === response.success) {
                        $.when(CATEGORIES.getCategories(), CATEGORIES.getCategoriesList() ).then(function () {
                            $jq.editKimIcon.click().click();
                            $jq.editCategoryModal.modal('hide');
                            setTimeout(methods.MESSAGES.show.bind(this, response), 300);
                        });
                    } else {
                        methods.MESSAGES.show(response);
                    }
                });
            }
        });

        $('#addKIMBtn').click(function(){
            var kim = VALIDATION.validateInputVal({
                    val: $jq.kimInput.val(),
                    id: '#kimInput',
                    digitsOnly: true
                }),
                kimHardInput = VALIDATION.validateInputVal({
                    val: $jq.kimHardInput.val(),
                    id: '#kimHardInput',
                    unique: true
                });
            if (kim && kimHardInput) {
                KIM.addKIM(kim, kimHardInput, $jq.kimDescrInput.val());
            }
        });
        $('#editKimBtn').click(KIM.editKimBtn);

        $('#addMetallBtn').click(function(){
            var metall = VALIDATION.validateInputVal({
                    val: $jq.metallNameInput.val(),
                    id: '#metallName',
                    unique: true
                }),
                price =  VALIDATION.validateInputVal({
                    val: $jq.metallPriceInput.val(),
                    id: '#metallPrice',
                    digitsOnly: true
                }),
                mass =  VALIDATION.validateInputVal({
                    val: $jq.metallMassInput.val(),
                    id: '#metallMass',
                    digitsOnly: true
                }),
                outPrice =  VALIDATION.validateInputVal({
                    val: $jq.metallOutPriceInput.val(),
                    id: '#metallOutPrice',
                    digitsOnly: true
                }),
                article = VALIDATION.validateInputVal({
                    val: $jq.metallArticleInput.val(),
                    id: '#metallArticle',
                    unique: true
                });
            if (metall && price && mass && outPrice && article) {
                METALLS.addMetall({
                    metall: metall,
                    price: price,
                    mass: mass,
                    outPrice: outPrice,
                    article: article
                });
            }
        });
        $('#editMetallBtn').click(function(){
            var id = MAIN.$selectedRow.attr('data-id' ),
                metallName = VALIDATION.validateInputVal({
                    val: $jq.editMetallNameInput.val()
                }),
                metallPrice =  VALIDATION.validateInputVal({
                    val: $jq.editMetallPriceInput.val(),
                    digitsOnly: true
                }),
                metallMass =  VALIDATION.validateInputVal({
                    val: $jq.editMetallMassInput.val(),
                    digitsOnly: true
                }),
                metallOutPrice =  VALIDATION.validateInputVal({
                    val: $jq.editMetallOutPriceInput.val(),
                    digitsOnly: true
                });
            if (metallName && metallPrice && metallMass && metallOutPrice) {
                $.when(METALLS.editMetall({
                    metallId: id,
                    metallName: metallName,
                    metallPrice: metallPrice,
                    metallMass: metallMass,
                    metallOutPrice: metallOutPrice
                })).then(function (response) {
                    if (true === response.success) {
                        $.when(METALLS.getMetalls(), METALLS.getMetallsList()).then(function () {
                            $jq.editKimIcon.click().click();
                            $jq.editMetallModal.modal('hide');
                            setTimeout(methods.MESSAGES.show.bind(this, response), 300);
                        });
                    } else {
                        methods.MESSAGES.show(response);
                    }
                    if (MAIN.isArticle && (id === MAIN.metallId)) {
                        PRODUCT.getLeftTabContent(MAIN.productId, MAIN.curTabId);
                    }
                });
            }
        });
        $('#uploadImageProduct').click(function (e) {
            $('#input-file-upload').trigger('click');
        });

        $('#input-file-upload').change(function () {
            if(!window.File || !window.FileReader || !window.FileList || !window.Blob){
                window.alert("Can't upload! Your browser does not support File API!");
                return;
            }

            var fileReader = new FileReader();
            var filter = /^(?:image\/bmp|image\/cis\-cod|image\/gif|image\/ief|image\/jpeg|image\/jpeg|image\/jpeg|image\/pipeg|image\/png|image\/svg\+xml|image\/tiff|image\/x\-cmu\-raster|image\/x\-cmx|image\/x\-icon|image\/x\-portable\-anymap|image\/x\-portable\-bitmap|image\/x\-portable\-graymap|image\/x\-portable\-pixmap|image\/x\-rgb|image\/x\-xbitmap|image\/x\-xpixmap|image\/x\-xwindowdump)$/i;
            if (this.files.length == 0) {
                window.alert('Нужно выбрать файл');
                return;
            }
            var file = this.files[0];
            var size = file.size;
            var type = file.type;

            if (!filter.test(type)) {
                window.alert('Формат файла не поддерживается');
                return;
            }

            var max = 2000000;
            if (size > max) {
                window.alert('Файл больше чем 2 MB');
                return;
            }

            $('.upload-image').show();
            fileReader.onload = imageIsLoaded;
            fileReader.readAsDataURL(this.files[0]);
            function imageIsLoaded(e) {
                $('#productImgWrapper').html(`<img id="productImg" height="250px" src="${e.target.result}" alt="your image" />`);
            };

            MAIN.formData = new FormData();
            MAIN.formData.append('image_data', file);
        });

        $('#addNewProductIcon').click(function () {
           // $('#productImgWrapper').html('');
            var kimVal = $jq.addNewProductModal.find('.kimList option:selected').attr('data-val'),
                metallList = $jq.addNewProductModal.find('.metallsList option:selected');
            $('#addNewProductModal [data-cell="KIM1"]').val(kimVal);
            $('#addNewProductModal [data-cell="PR1"]').val(metallList.attr('data-price'));
            $('#addNewProductModal [data-cell="PR2"]').val(metallList.attr('data-outprice'));
            methods.excel();
        });

        $('#showItemFromFileManager').click(function() {
            var product = [];
            $(this).hide();
            $.each($('.productsTreeDB li[data-section=product][aria-selected=true]'), function (num, obj) {
                product.push($(obj).attr('data-productid'));
            });
            console.log(product);
            $.when(TABS.openSavedProduct(product, 'new', false, false)).done(function(){
                window.location.href = LOCATION;
            });
        });

        //cancel create new formula
       // $('#cancelFormulaBtnPr' ).click(PRODUCT.cancelInputFormula);

        // hide all removeFormula icons
        //.find('.removeFormula' ).hide();
    };

    return appHandler;
});
<?php
use Phalcon\Db\RawValue;

class ProductsController extends ControllerBase
{
    public function getProductInfoAction()
    {
        $this->ajaxGetCheck();
        $res = false;
        $productObj = Products::findFirst($this->request->get('productId'));
        if ($productObj) {
            $metallObj = new MetallsController();
            $metallHistory = $metallObj->buildMetallHistoryObj($productObj->getMetall());
            $date = new DateTime();
            $res = [
                'product' => [
                    'created'  => $productObj->getCreated(),
                    'article'  => $productObj->getArticle(),
                    'name'     => $productObj->getProductName(),
                    'category' => $productObj->Categories->getCategoryName(),
                    'kim'      => $productObj->Kim->getKimHard(),
                    'metall'   => $productObj->Metalls->getName(),
                    'image'    => $productObj->getImage() . '?' . $date->getTimestamp()
                ],
                'metallHistory' => $metallHistory,
                'tableContent'  => json_decode($productObj->getTableContent(), true),
                'alwaysInTable' => json_decode($productObj->getAlwaysintable(), true),
                'formulas'      => json_decode($productObj->getFormulas(), true)
            ];
        }
        $this->response->setJsonContent($res);

        return $this->response;
    }
    
    public function addBtnToFormulasHelperAction(){
        $this->ajaxPostCheck();
        $success = 0;
        $msg = 'Ошибка при добавлении шаблона формулы';
        $newFl = $this->request->getPost('newFl');
        $fh = new FormulasHelper();
        $fh->setName($newFl);
        if ($fh->save()) {
            $success = 1;
            $data = ['id' => $fh->getId()];
        }

        $this->response->setJsonContent(['success' => $success, 'msg' => $msg, 'data' => $data]);

        return $this->response;
    }

    public function removeBtnFromFormulasHelperAction($id){
        $this->ajaxDeleteCheck();
        $res = false;
        $msg = 'Ошибка при удалении шаблона формулы';
        $fh = FormulasHelper::findFirst($id);
        if ($fh != false) {
            try {
                if ($fh->delete()) {
                    $res = true;
                    $msg = true;
                }
            } catch (\Exception $e) {

            }
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
    }
    
    public function getProductsTreeAction(){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $tree = [];
            $i = 1;
            $catObj = Categories::find();
            if (count($catObj)) {
                foreach ($catObj as $val) {
                    $catId = $val->getCategoryId();
                    $catName = $val->getCategoryName();
                    $categoryNode = [
                        'label'    => $catName,
                        'children' => [],
                        'id'       => $i
                    ];
                    $metallObj = Metalls::find();
                    if (count($metallObj)) {
                        foreach ($metallObj as $metVal) {
                            $i++;
                            $metId = $metVal->getId();
                            $metName = $metVal->getName();
                            $metallNode = [
                                'label'    => $metName,
                                'children' => [],
                                'id'       => $i
                            ];
                            $pr = Products::find(
                                "category_id = '" . $catId . "' AND metall = '" . $metId . "' AND status = 'save' AND article != 'NULL'"
                            );
                            if (count($pr)) {
                                foreach ($pr as $prVal) {
                                    $i++;
                                    $productNode = [
                                        'label' => $prVal->getArticle() . '___' . $prVal->getProductName(),
                                        'productId'    => $prVal->getProductId(),
                                        'id'    => $i
                                    ];
                                    array_push($metallNode['children'], (object)$productNode);
                                }
                            }
                            if (count($metallNode['children'])) {
                                array_push($categoryNode['children'], (object)$metallNode);
                            }
                        }
                    }
                    if (count($categoryNode['children'])) {
                        array_push($tree, (object)$categoryNode);
                    }
                    $i++;
                }
            }
            $this->response->setJsonContent($tree);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function saveProductAction () {
        $this->ajaxPostCheck();
        $success = false;
        $msg = 'Вы не создали Артикул или Такой Артикул уже существует!';
        $article = $this->request->getPost('article');
        $image = $this->request->getPost('image');
        $data = [];
        if ($article && !Products::findFirst(array("article = '$article'"))) {
            $product = new Products();
            $product->setArticle($article)
                ->setProductName($this->request->getPost('productName'))
                ->setCategoryId($this->request->getPost('category'))
                ->setKim($this->request->getPost('kim'))
                ->setMetall($this->request->getPost('metall'))
                ->setTableContent(json_encode($this->request->getPost('tableContent')))
                ->setAlwaysInTable(json_encode($this->request->getPost('alwaysInTable')))
                ->setFormulas(json_encode($this->request->getPost('formulas')))
                ->setStatus('save');
            if ($image) {
                $product->setImage($image);
            }
            if ($product->save()) {
                $success = true;
                $msg = 'Изделие Успешно Создано!';
                if (!$image) {
                    $data['id'] = [$product->getProductId()];
                }
            }
        }
        $this->response->setJsonContent(['success' => $success, 'msg' => $msg, 'data' => $data]);

        return $this->response;
    }

    public function deleteProductAction() {
        $this->ajaxPostCheck();
        $productsId = $this->request->getPost('productsId');
        if ($productsId) {
            foreach ($productsId as $productId) {
                $productsInOrderObj = Productinorder::findFirst(array("productId = '$productId'"));
                if (!$productsInOrderObj) {
                    $tabsObj = Tabs::findFirst(array("product_id = '$productId'"));
                    if ($tabsObj) {
                        try {
                            $tabsObj->delete();
                        } catch (\Exception $e) {

                        }
                    }

                    $familiesObj = Families::find(array("product_id = '$productId'"));
                    if ($familiesObj) {
                        foreach ($familiesObj as $key => $val) {
                            try {
                                $val->delete();
                            } catch (\Exception $e) {

                            }
                        }
                    }
                    $productObj = Products::findFirst($productId);
                    if ($productObj) {
                        try {
                            $productObj->delete();
                        } catch (\Exception $e) {

                        }
                    }
                }
            }

        }
        $this->response->setJsonContent(['success' => true]);

        return $this->response;
    }

    public function uploadImageAction ($productId) {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prObj = Products::findFirst(array("product_id = '$productId'"));
            $this->response->setContentType('application/json', 'UTF-8');
            if ($prObj == false) {
                $this->response->setJsonContent(false);
                return $this->response;
            }
            if(isset($_POST) && isset($_SERVER['HTTP_X_REQUESTED_WITH']) && strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest'){
                if(!isset($_FILES['image_data']) || !is_uploaded_file($_FILES['image_data']['tmp_name'])){
                    $this->response->setJsonContent(false);
                    return $this->response;
                }
                $tmp_name = $_FILES['image_data']['tmp_name'];

                //get mime type from valid image
                if(!getimagesize($tmp_name)){
                    $this->response->setJsonContent(false);
                    return $this->response;
                }
                move_uploaded_file($tmp_name, 'img/' . $productId . '.jpg');
                $prObj->setImage($productId . '.jpg');
                if ($prObj->save()) {
                    $this->response->setJsonContent(true);
                    return $this->response;
                } else {
                    $this->response->setJsonContent(false);
                    return $this->response;
                }
            } else {
                $this->response->setJsonContent(false);
                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }
    
    public function createTableRes($table, $template){
        $substObj = new Substitution();
        $tabContArr = [];
        $tableRes = '';
        foreach ($table as $key => $val) {
            foreach ($val as $k => $v) {
                $tabContArr[$k] = $v;
            }
            $tableRes .= $substObj->subHTMLReplace($template, $tabContArr);
            $tabContArr = [];
        }

        return $tableRes;
    }
    
    public function createProductInOrder($productId, $quantity, $orderId, $i, $map, $moveTo, $section) {
        $substObj = new Substitution();
        $productObj = Products::findFirst($productId);
        $metallId = $productObj->getMetall();
        $metallObj = Metalls::findFirst($metallId);
        $orObj = Productinorder::findFirst(
            "orderId = '" . $orderId . "' AND productId = '" . $productId . "'"
        );
        $alwaysInTable = json_decode($orObj->getAlwaysInTable());
        $actionArr = array('%ROWCLASS%' => 'Without', '%PRODUCT_ID%' => $productId, '%I%' => $i - 1);
        $moveToCopyTo = '<div class="col-md-8" style="margin-right: -64px; margin-left: -32px;">'
                        . '<select class="moveToAction">'
                            . '<option value="copy">Скопировать в </option>'
                            . '<option value="move">Переместить в </option>'
                        . '</select>';
        $moveCopyDropdown = '<select class="moveToPath">';
        if ('orderTableSection' === $map) {
            $actionArr['%ROWCLASS%'] = '';
        }
        foreach ($moveTo as $key => $val) {
            if (!count($val)) {
                $moveCopyDropdown .= '<option>' . $key . '</option>';
            } else {
                $checkArr = array();
                foreach ($val as $num => $obj) {
                    foreach ($obj as $id => $calc) {
                        array_push($checkArr, $id);
                    }
                }
                if (!in_array($productId, $checkArr)) {
                    $moveCopyDropdown .= '<option>' . $key . '</option>';
                }
            }
        }
        $moveCopyDropdown .= '</select><span class="glyphicon glyphicon-circle-arrow-right moveToCopyTo" name="' . $productId . '" data-section="' . $section . '" aria-hidden="true"></span></div>';
        $actionArr['%MOVE_TO%'] = $moveToCopyTo . $moveCopyDropdown;
        $actionArr['%SECTION%'] = $section;
        $actionRow = $substObj->subHTMLReplace('actionsInRow.html', $actionArr);
        $res['%ROW_CLASS%'] = $map;
        $res['%ACTIONS%'] = $actionRow;
        $res['%NUM%'] = $i;
        $res['%ARTICLE%'] = $productObj->getArticle();
        $res['%PRODUCT_ID%'] = $productObj->getProductId();
        $res['%NAME%'] = $productObj->getProductName();
        $res['%NAME_METALL%'] = $metallObj->getName();
        $res['%ORDER_ID%'] = $orderId;
        $res['%PRODUCT_ID%'] = $productId;
        $res['%QUANTITY%'] = $quantity;
        $res['%PRICE%'] = $alwaysInTable->{'3'}->{'%INPUT_VALUE%'};
        $res['%SUM%'] = (float)$alwaysInTable->{'3'}->{'%INPUT_VALUE%'} * (int)$quantity;
        $res['%PRICE_OUT%'] = $alwaysInTable->{'5'}->{'%INPUT_VALUE%'};
        $res['%SUM_OUT%'] = (float)$alwaysInTable->{'5'}->{'%INPUT_VALUE%'} * (int)$quantity/* - (int)$alwaysInTable->{'5'}->{'%INPUT_VALUE%'} * (int)$discount/100*/;
        
        return $substObj->subHTMLReplace('orderRow.html', $res);
    }
}
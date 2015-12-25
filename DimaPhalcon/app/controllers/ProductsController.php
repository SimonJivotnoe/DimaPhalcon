<?php
use Phalcon\Db\RawValue;

class ProductsController extends \Phalcon\Mvc\Controller
{

    public function createTableAction()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $tableContent = $this->request->getPost('tableContent');
            $alwaysInTable = $this->request->getPost('alwaysInTable');
            $product = Products::findFirst($prId);
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $product->setTableContent($tableContent)
                        ->setAlwaysInTable($alwaysInTable)
                        ->save();
                $substObj = new Substitution();
                $tabContArr = [];
                $tableRes = '';
                $table = json_decode($tableContent);
                foreach ($table as $key => $val) {
                    foreach ($val as $k => $v) {
                        $tabContArr[$k] = $v;
                    }
                    $tableRes .= $substObj->subHTMLReplace('tableContent.html', $tabContArr);
                    $tabContArr = [];
                }
                $alwaysRes = '';
                $table = json_decode($alwaysInTable);
                foreach ($table as $key => $val) {
                    foreach ($val as $k => $v) {
                        $tabContArr[$k] = $v;
                    }
                    $alwaysRes .= $substObj->subHTMLReplace('alwaysInTable.html', $tabContArr);
                    $tabContArr = [];
                }
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent([$tableRes, $alwaysRes]);

                return $this->response;
            }
        }
    }

    public function saveArticleOfProductAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $article = $this->request->getPost('article');
            $findArticle = Products::findFirst(array("article = '$article'"));
            $this->response->setContentType('application/json', 'UTF-8');
            if ($findArticle != false) {
                $this->response->setJsonContent(['status' => 'already', 'id' => $findArticle->getProductId()]);
                return $this->response;
            }
            $productObj = Products::findFirst($prId);
            $productObj->setArticle($article);
            try {
                $productObj->save();
            } catch (\Exception $e) {
                $this->response->setJsonContent(['status' => 'error']);
                return $this->response;
            }
            $this->response->setJsonContent(['status' => true]);
            return $this->response;

        } else {
            $this->response->redirect('');
        }
    }

    public function changeTableContentAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $tableContent = $this->request->getPost('tableContent');
            $alwaysInTable = $this->request->getPost('alwaysInTable');

            $product = Products::findFirst(array("product_id = '$prId'"));
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $product->setTableContent($tableContent)
                        ->setAlwaysInTable($alwaysInTable)
                        ->save();
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }
    
    public function addBtnToFormulasHelperAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $newFl = $this->request->getPost('newFl');
            $fh = new FormulasHelper();
            $fh->setName($newFl);
            if ($fh->save() == false) {
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('already');
            } else {
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent(true);
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function removeBtnFromFormulasHelperAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $fhText = $this->request->getPost('fhText');
            $fh = FormulasHelper::findFirst(array("name = '$fhText'"));
            if ($fh->delete() == false) {
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('already');
            } else {
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent(true);
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function addNewFormulaAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $formulas = $this->request->getPost('formulas');
            $prId = $this->request->getPost('prId');
            $pr = Products::findFirst(array("product_id = '$prId'"));
            $this->response->setContentType('application/json', 'UTF-8');
            $pr->setFormulas($formulas);
            if ($pr->save() == false) {
                $this->response->setJsonContent('already');
            } else {
                $formulaHelperObj = new FormulasController;
                $this->response->setJsonContent(['status' => true, 'formulasList' => $formulaHelperObj->createFormulasList(json_decode($pr->getFormulas()))]);
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function saveProductInDBAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $pr = Products::findFirst(array("product_id = '$prId'"));
            $this->response->setContentType('application/json', 'UTF-8');
            $pr->setStatus('save');
            if ($pr->save() == false) {
                $this->response->setJsonContent(false);
            } else {
                $this->response->setJsonContent(true);
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function getProductsTreeAction(){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $tree = [];
            $catObj = Categories::find();
            if (count($catObj)) {
                foreach ($catObj as $val) {
                    $catId = $val->getCategoryId();
                    $catName = $val->getCategoryName();
                    $node = [
                        'label'    => $catName,
                        'children' => []
                    ];
                    $metallObj = Metalls::find();
                    if (count($metallObj)) {
                        foreach ($metallObj as $metVal) {
                            $metId = $metVal->getId();
                            $metName = $metVal->getName();
                            $node2 = [
                                'label'    => $metName,
                                'children' => []
                            ];
                            $pr = Products::find(
                                "category_id = '" . $catId . "' AND metall = '" . $metId . "'"
                            );
                            if (count($pr)) {
                                foreach ($pr as $prVal) {
                                    $child = [
                                        'label' => $prVal->getArticle() . '___' . $prVal->getProductName(),
                                        'id'    => $prVal->getProductId()
                                    ];
                                    array_push($node2['children'], (object)$child);
                                }
                            }
                            if (count($node2['children'])) {
                                array_push($node['children'], (object)$node2);
                            }
                        }
                    }
                    if (count($node['children'])) {
                        array_push($tree, (object)$node);
                    }
                }
            }
            $this->response->setJsonContent($tree);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function createProductFromTemplateAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $tab = $this->request->getPost('tab');
            $productId = '';
            $pr = Products::findFirst(array("product_id = '$prId'"));
            $this->response->setContentType('application/json', 'UTF-8');
            $product = new Products();
            $product->setProductName($pr->getProductName())
                    ->setArticle(new RawValue('default'))
                    ->setCategoryId($pr->getCategoryId())
                    ->setKim($pr->getKim())
                    ->setMetall($pr->getMetall())
                    ->setTableContent($pr->getTableContent())
                    ->setAlwaysintable($pr->getAlwaysintable())
                    ->setFormulas($pr->getFormulas())
                    ->setCreated(new RawValue('default'))
                    ->setStatus(new RawValue('default'))
                    ->setTemplate(new RawValue('default'))
                    ->setImage(new RawValue('default'));
            if ($product->save() == false) {
                $message = $product->getMessages();
                $this->response->setJsonContent(false);
                return $this->response;
            } else {
                $productId = $product->getProductId();
            }
            if ('new' === $tab) {
                $tabObj = new Tabs();
                $tabId = Tabs::maximum(array("column" => "id"));
                $tabs = Tabs::find("active = 1");
                foreach ($tabs as $val) {
                    $val->setActive(0);
                    $val->save();
                }
                $tabObj->setTabId('pr' . $tabId)
                        ->setProductId($productId)
                        ->setActive(1)
                        ->save();
            } else {
                $tabs = Tabs::findFirst(array("tab_id = '$tab'"));
                $tabs->setProductId($productId)
                     ->save();
            }
            $this->response->setJsonContent(true);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
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
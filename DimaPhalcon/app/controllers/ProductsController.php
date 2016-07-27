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
    
    public function getProductModel ($productId) {
        $res = false;
        $productObj = Products::findFirst($productId);
        $metallObj = new MetallsController();
        $date = new DateTime();
        if ($productObj) {
            $res = [
                'image'         => $productObj->getImage(),
                'productImage'  => $productObj->getImage() . '?' . $date->getTimestamp(),
                'productName'   => $productObj->getProductName(),
                'categoryId'    => $productObj->getCategoryId(),
                'kimId'         => $productObj->getKim(),
                'metallId'      => $productObj->getMetall(),
                'tableContent'  => json_decode($productObj->getTableContent()),
                'alwaysInTable' => json_decode($productObj->getAlwaysInTable()),
                'formulas'      => json_decode($productObj->getFormulas()),
                'metallHistory' => $metallObj->buildMetallHistoryObj($productObj->getMetall()),
            ];
        }
        return $res;
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
                        $image = $productObj->getImage();
                        if ($image) {
                            $imagesObj = Products::find(array("image = '$image'"));
                            if (1 == count($imagesObj)) {
                                unlink('img/' . $image);
                            }
                        }
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
        $this->ajaxPostCheck();
        $res = false;
        $prObj = Products::findFirst(array("product_id = '$productId'"));
        if ($prObj) {
            if(
                isset($_POST) &&
                isset($_SERVER['HTTP_X_REQUESTED_WITH']) &&
                strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) == 'xmlhttprequest' &&
                isset($_FILES['image_data']) &&
                is_uploaded_file($_FILES['image_data']['tmp_name'])    
            ){
                $tmp_name = $_FILES['image_data']['tmp_name'];

                //get mime type from valid image
                if(getimagesize($tmp_name)){
                    move_uploaded_file($tmp_name, 'img/' . $productId . '.jpg');
                    $prObj->setImage($productId . '.jpg');
                    if ($prObj->save()) {
                        $res = true;
                    }
                }
            }
        }
        $this->response->setJsonContent($res);

        return $this->response;
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
<?php

class FamilyController extends ControllerBase
{

    public function addToFamilyAction() {
        $this->ajaxPostCheck();
        $res = true;
        $msg = 'Семейство успешно создано!';

        $familyName = $this->request->getPost('familyName');
        $productsId = $this->request->getPost('productsId');
        if ($familyName && count($productsId)) {
            foreach ($productsId as $productId) {
                if (!Families::findFirst("name = '" . $familyName . "' AND product_id = '" . $productId . "'")) {
                    $familyObj = new Families();
                    $familyObj->setName($familyName)->setProductId($productId);
                    try {
                        $familyObj->save();
                    } catch (\Exception $e) {}
                }
            }
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);
        return $this->response;
    }

    public function removeFromFamilyAction($productArr) {
        $this->ajaxDeleteCheck();
        $productsIdArr = [];
        try {
            $productsIdArr = json_decode($productArr);
        } catch (\Exception $e) {}
        if (count($productsIdArr)) {
            foreach ($productsIdArr as $productId) {
                $familyObj = Families::findFirst("product_id = '" . $productId . "'");
                if ($familyObj != false) {
                    try {
                        $familyObj->delete();
                    } catch (\Exception $e) {}
                }
            }
        }
        $this->response->setJsonContent(['success' => true]);
        return $this->response;
    }
}


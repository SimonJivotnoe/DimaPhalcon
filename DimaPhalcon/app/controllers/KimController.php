<?php

class KimController  extends ControllerBase
{

    public function getKimAction () {
        $this->ajaxGetCheck();
        $kimObj = Kim::find();
        $kimArr = [];
        $names = [];
        $data = [];
        if ($kimObj) {
            foreach ($kimObj as $kim) {
                $id = $kim->getKimId();
                $name = $kim->getKimHard();
                $value =$kim->getKim();
                $description = $kim->getDescription();
                array_push($kimArr, [
                    'id'          => $id,
                    'name'        => $name,
                    'value'       => $value,
                    'description' => $description
                ]);
                array_push($names, $name);
                $data[$id] = [
                    'name'        => $name,
                    'value'       => $value,
                    'description' => $description
                ];
            }
            $resObj = [
                'names' => $names,
                'data' => $data
            ];
        }
        $this->response->setJsonContent(['template' => $kimArr, 'kimTableContent' => $resObj]);
        return $this->response;
    }
    
    public function addKIMAction()
    {
        $this->ajaxPostCheck();
        $res = false;
        $msg = 'Такой КИМ уже существует!';
        $kimObj = new Kim;
        $kimObj->setKim($this->request->getPost('kim'))
               ->setKimHard($this->request->getPost('kimHard'))
               ->setDescription($this->request->getPost('description'));
        if ($kimObj->save() === true) {
            $res = true;
            $msg = 'КИМ успешно добавлен';
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
    }

    public function editKimAction()
    {
        $this->ajaxPostCheck();
        $res = false;
        $msg = 'Такой КИМ уже существует!';
        $name = $this->request->getPost('kimHard');
        $id = $this->request->getPost('kimId');
        $kimObj = Kim::findFirst($id);
        if ($kimObj &&
            $kimObj->setKimHard($name)
                ->setKim($this->request->getPost('kim'))
                ->setDescription($this->request->getPost('description'))->save()) {
            $res = true;
            $msg = 'КИМ успешно отредактирован';
        }
        /*$kimQ = Kim::findFirst(
                "kim_hard = '" . $name . "' AND kim_id != '" . $id . "'");
        if ($kimQ == false) {
            $kimObj = Kim::findFirst($id);
            if ($kimObj &&
                    $kimObj->setKimHard($name)
                         ->setKim($this->request->getPost('kim'))
                         ->setDescription($this->request->getPost('description'))->save()) {
                $res = true;
                $msg = 'КИМ успешно отредактирован';
            }
        }*/
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
    }

    public function getKimListAction()
    {
        $this->ajaxGetCheck();
        $prId = $this->request->get('prId');
        $product = Products::findFirst($prId);
        $kimList = ['html' => []];
        if ($product) {
            $productKim = $product->getKim();
            $kimList = $this->createKimList($productKim);
        }
        $this->response->setJsonContent($kimList);

        return $this->response;
    }

    public function removeKimAction($kimId)
    {
        $this->ajaxDeleteCheck();
        $res = false;
        $msg = 'Этот КИМ используется в продукте!';
        $kimObj = Kim::findFirst($kimId);
        if ($kimObj != false) {
            try {
                if ($kimObj->delete()) {
                    $res = true;
                    $msg = 'КИМ успешно удален';
                }
            } catch (\Exception $e) {

            }
        }
        
        return $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);
    }

    public function createKimList($productKim, $isArticle = false)
    {
        $kimList = '';
        $kim = Kim::find(array("order" => "kim ASC"));
        foreach ($kim as $val) {
            if ($isArticle) {
               if ($productKim === $val->getKimId()) {
                    $kimList = $val->getKimHard() . ': ' . $val->getKim();
                } 
            } else {
                if ($productKim === $val->getKimId()) {
                    $kimList .= '<option selected="selected" ';
                } else {
                    $kimList .= '<option ';
                }
                $kimList .= 'name="' . $val->getKimId()
                    . '" kim="' . $val->getKim() . '">'
                    . $val->getKimHard() . ': ' . $val->getKim() . ' </option>';
            }
        }

        return ['html' => $kimList];
    }

}


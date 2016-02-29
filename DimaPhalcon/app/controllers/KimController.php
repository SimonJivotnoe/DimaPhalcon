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
        $this->response->setJsonContent(['kim' => $kimArr, 'kimTableContent' => $resObj]);
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
        if ($this->request->isAjax() && $this->request->isPost()) {
            $kimId = $this->request->getPost('kimId');
            $kim = $this->request->getPost('kim');
            $kimHard = $this->request->getPost('kimHard');

            $this->response->setContentType('application/json', 'UTF-8');

            $kimQ = Kim::findFirst($kimId);
            if ($kimQ == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($kimQ->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $kimQ->setKim($kim)
                    ->setKimHard($kimHard);
                if ($kimQ->save() == false) {
                    $this->response->setJsonContent('already');
                } else {
                    $this->response->setJsonContent(true);
                }

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
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
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);
        
        return $this->response;
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


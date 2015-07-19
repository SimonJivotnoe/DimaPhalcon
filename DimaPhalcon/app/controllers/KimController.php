<?php

class KimController extends \Phalcon\Mvc\Controller
{

    public function addKIMtoTableAction()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $kimK = $this->request->getPost('kim');
            $kimPrice = $this->request->getPost('kimPrice');
            $kim = new Kim;
            $kim->setKim($kimK)
                ->setKimPrice($kimPrice)
                ->save();
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent('ok');

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function getKIMTableAction(){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $kim = Kim::find();
            $res = '<tr><th>КИМ</th><th>Цена за м2,грн</th></tr>';
            $resObj = [];
            foreach ($kim as $val) {
                $res .= '<tr>
                            <td>'. $val->getKim() . '</td>
                            <td><span contenteditable="true">' . $val->getKimPrice() . '</span></td>
                        </tr>';
                $resObj[$val->getKim()] = $val->getKimPrice();
            }

            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent(array($res, (object)$resObj));

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

}


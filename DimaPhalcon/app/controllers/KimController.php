<?php

class KimController extends \Phalcon\Mvc\Controller
{

    public function addKIMtoTableAction()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $kimK = $this->request->getPost('kim');
            $kimHard = $this->request->getPost('kimHard');
            $kim = new Kim;
            $kim->setKim($kimK)
                ->setKimHard($kimHard)
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
            $kim = Kim::find(array(
                "order" => "kim ASC"));
            $res = '<tr><th>Сложность изделия</th><th>КИМ</th></tr>';
            $resObj = [];
            foreach ($kim as $val) {
                $res .= '<tr>
                            <td><span contenteditable="true">' . $val->getKimHard() . '</span></td>
                            <td><span contenteditable="true">'. $val->getKim() . '</span></td>
                        </tr>';
                $resObj[$val->getKim()] = $val->getKimHard();
            }

            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent(array($res, (object)$resObj));

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

}


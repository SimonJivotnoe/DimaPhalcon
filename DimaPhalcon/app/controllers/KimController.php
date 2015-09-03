<?php

class KimController extends \Phalcon\Mvc\Controller
{

    public function addKIMtoTableAction()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $kimK = $this->request->getPost('kim');
            $kimHard = $this->request->getPost('kimHard');
            $kim = new Kim;
            $kim->setKim($kimK)->setKimHard($kimHard);
            $this->response->setContentType('application/json', 'UTF-8');
            if ($kim->save() == false) {
                $this->response->setJsonContent('already');
            } else {
                $this->response->setJsonContent(true);
            }

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function getKIMTableAction()
    {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $kim = Kim::find(array("order" => "kim ASC"));
            $res = '<tr><th>Сложность изделия</th><th>КИМ</th><th class="editKimTable"></th></tr>';
            $resObj = [];
            foreach ($kim as $val) {
                $res .= '<tr>
                            <td><span class="kimHardName">' . $val->getKimHard() . '</span></td>
                            <td><span class="kimName">' . $val->getKim() . '</span></td>
                            <td class="editKimTable">
                                <span class="glyphicon glyphicon-pencil triggerKimPencil" aria-hidden="true" name="' . $val->getKimId() . '"></span>
                                <span class="glyphicon glyphicon-remove triggerRemoveKim" aria-hidden="true" name="' . $val->getKimId() . '"></span>
                                </td>
                        </tr>';
                $resObj[ $val->getKim() ] = $val->getKimHard();
            }

            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent(array('html' => $res, 'kimTableContent' => (object)$resObj));

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function editKimAction()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $kimId = $this->request->getPost('kimId');
            $kim = $this->request->getPost('kim');
            $kimHard = $this->request->getPost('kimHard');
            $kimQ = Kim::findFirst($kimId);
            if ($kimQ == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($kimQ->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $kimQ->setKim($kim)->setKimHard($kimHard);
                $this->response->setContentType('application/json', 'UTF-8');
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
        if ($this->request->isAjax() && $this->request->isGet()) {
            $prId = $this->request->get('prId');
            $product = Products::findFirst($prId);
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $productKim = $product->getKim();
                $kimList = '';
                $kim = Kim::find(array("order" => "kim ASC"));
                foreach ($kim as $val) {
                    if ($productKim === $val->getKimId()) {
                        $kimList .= '<option selected="selected" name="' . $val->getKimId() . '" kim="' . $val->getKim() . '">' . $val->getKimHard() . ': ' . $val->getKim() . ' </option>';
                    } else {
                        $kimList .= '<option name="' . $val->getKimId() . '" kim="' . $val->getKim() . '">' . $val->getKimHard() . ': ' . $val->getKim() . ' </option>';
                    }
                }
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent($kimList);

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function removeKimAction()
    {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $kimId = $this->request->getPost('kimId');
            $kim = Kim::findFirst($kimId);
            if ($kim != false) {
                if ($kim->delete() == false) {
                    echo "К сожалению, мы не можем удалить робота прямо сейчас: \n";
                    foreach ($kim->getMessages() as $message) {
                        echo $message, "\n";
                    }
                } else {
                    $this->response->setContentType('application/json', 'UTF-8');
                    $this->response->setJsonContent(true);

                    return $this->response;
                }
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function createKimList($productKim)
    {
        $kimList = '';
        $kim = Kim::find(array("order" => "kim ASC"));
        foreach ($kim as $val) {
            if ($productKim === $val->getKimId()) {
                $kimList .= '<option selected="selected" name="' . $val->getKimId() . '" kim="' . $val->getKim() . '">' . $val->getKimHard() . ': ' . $val->getKim() . ' </option>';
            } else {
                $kimList .= '<option name="' . $val->getKimId() . '" kim="' . $val->getKim() . '">' . $val->getKimHard() . ': ' . $val->getKim() . ' </option>';
            }
        }

        return $kimList;
    }

}


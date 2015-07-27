<?php


class MetallsController extends \Phalcon\Mvc\Controller
{
    public function getMetallsTableAction(){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $met = Metalls::find(array(
                "order" => "price ASC"));
            $res = '<tr>
                        <th>Металл</th>
                        <th>Цена</th>
                        <th>Масса</th>
                        <th>Исходящая цена</th>
                        <th class="editMetallTable"></th>
                    </tr>';
            foreach ($met as $val) {
                $res .= '<tr>
                            <td><span class="metallName">' . $val->getName() . '</span></td>
                            <td><span class="metallPrice">'. $val->getPrice() . '</span></td>
                            <td><span class="metallMass">'. $val->getMass() . '</span></td>
                            <td><span class="metallOutPrice">'. $val->getOutPrice() . '</span></td>
                            <td class="editMetallTable">
                                <span class="glyphicon glyphicon-pencil triggerMetallPencil" aria-hidden="true" name="'. $val->getId() . '"></span>
                                <span class="glyphicon glyphicon-remove triggerRemoveMetall" aria-hidden="true" name="'. $val->getId() . '"></span>
                                </td>
                        </tr>';
            }

            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent($res);

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
} 
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
                        <th>Артикул</th>
                        <th class="editMetallTable"></th>
                    </tr>';
            $names = [];
            $article = [];
            foreach ($met as $val) {
                $res .= '<tr>
                            <td><span class="metallName">' . $val->getName() . '</span></td>
                            <td><span class="metallPrice">'. $val->getPrice() . '</span></td>
                            <td><span class="metallMass">'. $val->getMass() . '</span></td>
                            <td><span class="metallOutPrice">'. $val->getOutPrice() . '</span></td>
                            <td><span class="metallArticle">'. $val->getArticle() . '</span></td>
                            <td class="editMetallTable">
                                <span class="glyphicon glyphicon-pencil triggerMetallPencil" aria-hidden="true" name="'. $val->getId() . '"></span>
                                <span class="glyphicon glyphicon-remove triggerRemoveMetall" aria-hidden="true" name="'. $val->getId() . '"></span>
                                </td>
                        </tr>';
                array_push($names, $val->getName());
                array_push($article, $val->getArticle());
            }
            $resObj = ['names' => $names, 'articles' => $article];
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent(array('html' => $res, 'metallTableContent' => (object)$resObj));

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function addMetallToTableAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $name = $this->request->getPost('metall');
            $price = $this->request->getPost('price');
            $mass = $this->request->getPost('mass');
            $outPrice = $this->request->getPost('outPrice');
            $article = $this->request->getPost('article');

            $this->response->setContentType('application/json', 'UTF-8');

            $checkArticle = Metalls::findFirst("article = '" . $article . "'");
            if ($checkArticle) {
                $this->response->setJsonContent('already');
                return $this->response;
            }
            $metalls = new Metalls();
            $metalls->setName($name)
                    ->setPrice($price)
                    ->setMass($mass)
                    ->setOutPrice($outPrice)
                    ->setArticle($article);
            if ($metalls->save() == false) {
                $this->response->setJsonContent('already');
            } else {
                $this->response->setJsonContent(TRUE);
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function editMetallAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $metallId = $this->request->getPost('metallId');
            $metallName = $this->request->getPost('metallName');
            $metallPrice = $this->request->getPost('metallPrice');
            $metallMass = $this->request->getPost('metallMass');
            $metallOutPrice = $this->request->getPost('metallOutPrice');
            $article = $this->request->getPost('article');

            $this->response->setContentType('application/json', 'UTF-8');

            $checkArticle = Metalls::findFirst("article = '" . $article . "' AND id != '" . $metallId . "'");
            if ($checkArticle) {
                $this->response->setJsonContent('already');
                return $this->response;
            }
            $metallQ = Metalls::findFirst($metallId);
            if ($metallQ == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($metallQ->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $metallQ->setName($metallName)
                         ->setPrice($metallPrice)
                         ->setMass($metallMass)
                         ->setOutPrice($metallOutPrice)
                         ->setArticle($article);
                if ($metallQ->save() == false) {
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

    public function getMetallsListAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $prId = $this->request->get('prId');
            $product = Products::findFirst($prId);
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $productMetall = $product->getMetall();
                $metallsList = $this->createMetallsList($productMetall);
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent($metallsList);
                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function removeMetallAction (){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $metallId = $this->request->getPost('metallId');
            $metall = Metalls::findFirst($metallId);
            if ($metall != false) {
                if ($metall->delete() == false) {
                    echo "К сожалению, мы не можем удалить робота прямо сейчас: \n";
                    foreach ($metall->getMessages() as $message) {
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

    public function createMetallsList ($productMetall) {
        $metallsList = '';
        $article = '';
        $metalls = Metalls::find(array(
            "order" => "name ASC"));
        foreach ($metalls as $val) {
            if ($productMetall === $val->getId()) {
                $metallsList .= '<option selected="selected" ';
                $article = $val->getArticle();
            } else {
                $metallsList .= '<option ';
            }
            $metallsList .= 'name="' . $val->getId()
                .'" metall="' . $val->getPrice()
                .'" metallOut="' . $val->getOutPrice()
                . '" article="' . $val->getArticle()
                .'">'.
                $val->getName().': '.$val->getPrice().' грн</option>';
        }

        return ['html' => $metallsList, 'article' => $article];
    }
} 
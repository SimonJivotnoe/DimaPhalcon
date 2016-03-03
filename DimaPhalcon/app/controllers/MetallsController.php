<?php

use Phalcon\Db\RawValue;

class MetallsController extends ControllerBase
{
    public function getMetallsAction() {
        $this->ajaxGetCheck();
        $metallObj = Metalls::find(array("order" => "price ASC"));
        $metallsArr = [];
        $data = [];
        $names = [];
        $articles = [];
        if ($metallObj) {
            foreach ($metallObj as $met) {
                $id        = $met->getId();
                $name      = $met->getName();
                $price     = $met->getPrice();
                $mass      = $met->getMass();
                $out_price = $met->getOutPrice();
                $article   = $met->getArticle();
                array_push($metallsArr, [
                    'id'        => $id,
                    'name'      => $name,
                    'price'     => $price,
                    'mass'      => $mass,
                    'out_price' => $out_price,
                    'article'   => $article
                ]);
                array_push($names, $name);
                array_push($articles, $article);
                $data[$id] = [
                    'name'      => $name,
                    'price'     => $price,
                    'mass'      => $mass,
                    'out_price' => $out_price,
                    'article'   => $article
                ];
            }
            $resObj = [
                'names'    => $names,
                'articles' => $articles,
                'data'     => $data
            ];
        }
        $this->response->setJsonContent(['metalls' => $metallsArr, 'metallTableContent' => $resObj]);
        return $this->response;
    }

    public function addMetallAction(){
        $this->ajaxPostCheck();
        $name = $this->request->getPost('metall');
        $price = $this->request->getPost('price');
        $mass = $this->request->getPost('mass');
        $outPrice = $this->request->getPost('outPrice');
        $article = $this->request->getPost('article');
        $res = false;
        $msg = 'Такой Металл уже существует!';

        if (!Metalls::findFirst("article = '" . $article . "'")) {
            $metalls = new Metalls();
            $metalls->setName($name)
                    ->setPrice($price)
                    ->setMass($mass)
                    ->setOutPrice($outPrice)
                    ->setArticle($article);
            if ($metalls->save() != false) {
                $this->addToMetallHistory($metalls->getId(), $metalls->getPrice(), $metalls->getOutPrice());
                $res = true;
                $msg = 'Металл успешно добавлен';
            }
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
    }

    public function editMetallAction() {
        $this->ajaxPostCheck();
        $metallId = $this->request->getPost('metallId');
        $metallName = $this->request->getPost('metallName');
        $metallPrice = $this->request->getPost('metallPrice');
        $metallMass = $this->request->getPost('metallMass');
        $metallOutPrice = $this->request->getPost('metallOutPrice');
        $res = false;
        $msg = 'Такой Металл уже существует!';
        $metallQ = Metalls::findFirst($metallId);
        if ($metallQ && $metallQ->setName($metallName)
                ->setPrice($metallPrice)
                ->setMass($metallMass)
                ->setOutPrice($metallOutPrice)->save()) {
            $res = true;
            $msg = 'Металл успешно отредактирован';
            $this->addToMetallHistory($metallId, $metallPrice, $metallOutPrice);
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
    }

    public function removeMetallAction (){
        $this->ajaxPostCheck();
        $res = false;
        $msg = 'Этот Металл используется в продукте!';
        $metallId = $this->request->getPost('metallId');
        $res = false;
        $metall = Metalls::findFirst($metallId);
        $metallHistory = MetallPricesHistory::find(array("metall_id = '$metallId'"));
        if ($metall != false && $metallHistory != false) {
            try {
                if ($metallHistory->delete() && $metall->delete()) {
                    $res = true;
                    $msg = 'Категория успешно удалена';
                }
            } catch (\Exception $e) {

            }
        }
        $this->response->setJsonContent(['success' => $res, 'msg' => $msg]);

        return $this->response;
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

    public function getMetallHistoryAction($id){
        $this->ajaxGetCheck();
        $this->response->setJsonContent($this->buildMetallHistoryObj($id));

        return $this->response;
    }

    public function buildMetallHistoryObj($id)
    {
        $res = [];
        $history = MetallPricesHistory::find(array("metall_id = '$id'"));
        if ($history) {
            foreach ($history as $val) {
                array_push($res, [
                    'price' => $val->getPrice(),
                    'outPrice' => $val->getOutPrice(),
                    'date' => $val->getDate()
                ]);
            }
        }

        return $res;
    }
    
    public function createMetallsList ($productMetall, $isArticle = false) {
        $metallsList = '';
        $article = '';
        $metalls = Metalls::find(array(
            "order" => "name ASC"));
        foreach ($metalls as $val) {
            if ($isArticle) {
               if ($productMetall === $val->getId()) {
                    $metallsList = $val->getName().': '.$val->getPrice();
                    $article = $val->getArticle();
                } 
            } else {
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
        }
        return ['html' => $metallsList, 'article' => $article];
    }

    private function addToMetallHistory($id, $price, $outPrice) {
        $history = MetallPricesHistory::findFirst(
            "price = '" . $price . "' AND out_price = '" . $outPrice . "' AND metall_id = '" . $id . "'"
        );
        if ($history) {
            $history->setDate(new RawValue('default'))->save();
        } else {
            $historyObj = new MetallPricesHistory();
            $historyObj
                ->setPrice($price)
                ->setOutPrice($outPrice)
                ->setDate(new RawValue('default'))
                ->setMetallId($id)
                ->save();
        }
    }

    public function getMetallHistory($id) {
        $history = MetallPricesHistory::find(array("metall_id = '$id'"));
        $res = '<select id="metallHistorySelect">';
        foreach ($history as $val) {
            $res .= '<option data-price="' . $val->getPrice() . '" data-outprice="' . $val->getOutPrice() . '">' . $val->getDate() . ' | ' . $val->getPrice() . '-' . $val->getOutPrice() .'</option>';
        }
        $res .= '</select>';
        return $res;
    }
} 
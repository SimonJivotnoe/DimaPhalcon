<?php
use Phalcon\Db\RawValue;
class TabsController extends \Phalcon\Mvc\Controller
{

   public function getTabsListAction($tabId)
    {
        if ($this->request->isAjax() && $this->request->isGet()) {
            if ('all' === $tabId) {
                $tabs = Tabs::find();
                if ($tabs == false) {
                    echo "Мы не можем сохранить робота прямо сейчас: \n";
                    foreach ($tabs->getMessages() as $message) {
                        echo $message, "\n";
                    }
                } else {
                    if (count($tabs)) {
                        $substObj = new Substitution();
                        $tabsLi = '';
                        $active = 0;
                        $prodId = 0;
                        $tabArr = [];
                        foreach ($tabs as $val) {
                            $tabsList = array();
                            if ($val->getActive()) {
                                $tabsList[ '%ACTIVE%' ] = 'active';
                                $active = $val->getTabId();
                                $prodId = $val->getProductId();
                            } else {
                                $tabsList[ '%ACTIVE%' ] = '';
                            }
                            $tabsList['%ID%'] = $val->getId();
                            $tabsList['%TABID%'] = $val->getTabId();
                            $tabsList['%PRODUCT_ID%'] = $val->getProductId();
                            $product = Products::findFirst($val->getProductId());
                            $tabsList[ '%PRODUCT_NAME%' ] = $product->getProductName();
                            $tabsLi .= $substObj->subHTMLReplace('tab_li.html', $tabsList);
                            
                            $tabArr[$val->getTabId()] = (object)[
                                'active' => $val->getActive(),
                                'productId' => $val->getProductId()];
                        }
                        $tabObj = (object)$tabArr;
                        $kim = Kim::find();
                        $resObj = [];
                        foreach ($kim as $val) {
                            $resObj[$val->getKim()] = $val->getKimPrice();
                        }
                        $this->response->setContentType('application/json', 'UTF-8');
                        $this->response->setJsonContent(array($tabsLi, $active, $prodId, $tabObj, (object)$resObj));

                        return $this->response;
                    } else {
                        $this->response->setContentType('application/json', 'UTF-8');
                        $this->response->setJsonContent(array('', 0, '', ''));
                        return $this->response;
                    }
                }
            } else {
                $tabs = Tabs::maximum(array("column" => "id"));
                if(!empty($tabs)){
                    $this->response->setContentType('application/json', 'UTF-8');
                    $this->response->setJsonContent($tabs);
                } else {
                    $this->response->setContentType('application/json', 'UTF-8');
                    $this->response->setJsonContent(array());
                }
                return $this->response;
            }
        }  else {
            $this->response->redirect('');
        }
    }

    public function getTabContentAction($productId){
        if ($this->request->isAjax() && $this->request->isGet()) {
            $product = Products::findFirst($productId);
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $substObj = new Substitution();
                $tabContent = '';

                $productCatId = $product->getCategoryId();
                $productKim = $product->getKim();
                $productMetall = $product->getMetall();
                $table = json_decode($product->getTableContent());
                $alwaysInTable = json_decode($product->getAlwaysintable());

                $productObj = new ProductsController;
                $categoryObj = new CategoriesController;
                $kimObj = new KimController;
                $metallsObj = new MetallsController;
                $formulaHelperObj = new FormulasController;

                $prName = $product->getProductName();
                if ('Новое изделие' === $prName) {
                    $prName = '';
                }

                $formulas = json_decode($product->getFormulas());

                $productDetails = array(
                    '%PRODUCT_NAME%' => $prName,
                    '%CATEGORIES%' => $categoriesList = $categoryObj->createCategoriesList($productCatId),
                    '%KIM_LIST%' => $kimList = $kimObj->createKimList($productKim),
                    '%METALL_LIST%' => $metallList = $metallsObj->createMetallsList ($productMetall),
                    '%CREATED%' => $product->getCreated(),
                    '%TABLE_CONTENT%' => $tableRes = $productObj->createTableRes($table, 'tableContent.html'),
                    '%ALWAYS_IN_TABLE%' => $alwRes = $productObj->createTableRes($alwaysInTable, 'alwaysInTable.html'),
                    '%FORMULAS_HELPER%' => $formHelpList = $formulaHelperObj->createFormulaHelperList(),
                    '%FORMULAS%' => $formulasRes = $formulaHelperObj->createFormulasList($formulas)
                );
                $tabContent .= $substObj->subHTMLReplace('tabContent.html', $productDetails);
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent($tabContent);

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function changeActiveTabAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tabs = Tabs::find("active = 1");
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }
            if ($tabs == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($tabs->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $id = $this->request->getPost('id');
                $tabId = $this->request->getPost('tabId');
                $tabs = Tabs::find(array("id = '$id'", "tab_id = '$tabId'"));
                foreach ($tabs as $val) {
                    $val->setActive(1);
                    $val->save();
                }
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function addNewTabAction($id) {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tab = new Tabs();
            $categoryId = Categories::minimum(array("column" => "category_id"));
            if(empty($categoryId)){
                $category = new Categories();
                $category->setCategoryName('Нераспределенное');
                $category->save();
                $categoryId = Categories::minimum(array("column" => "category_id"));
            }
            $kimId = Kim::minimum(array("column" => "kim_id"));var_dump($kimId);
            if(empty($kimId)){
                $kim = new Kim();
                $kim->setKimHard('Прямой участок')
                    ->setKim('1.1')
                    ->save();
                $kimId = Kim::minimum(array("column" => "kim_id"));
            }
            $metallId = Metalls::minimum(array("column" => "id"));
            if(empty($metallId)){
                $metall = new Metalls();
                $metall->setName('металл оц. 0.55')
                       ->setPrice('185')
                       ->setMass('8.5')
                       ->setOutPrice('245')
                       ->save();
                $metallId = Metalls::minimum(array("column" => "id"));
            }
            $productId = '';
            $alwaysInTable = file_get_contents('files/alwaysInTable.json');
            $product = new Products();
            $product->setProductName('Новое изделие')
                    ->setCategoryId($categoryId)
                    ->setKim($kimId)
                    ->setMetall($metallId)
                    ->setAlwaysintable($alwaysInTable)
                    ->setCreated(new RawValue('default'))
                    ->setStatus(new RawValue('default'))
                    ->setTemplate(new RawValue('default'));
            //$product->setTableContent(new RawValue('default'));
            if ($product->save() == false)
            {
                $message = $product->getMessages();
                $this->response->setJsonContent(array($message[0]->__toString()));
                return $this->response;
            } else {
                $productId = $product->getProductId();
            }
            $tabs = Tabs::find("active = 1");
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }

            $tab->setTabId('pr'.$id)
                ->setProductId($productId)
                ->setActive(1)
                ->save();
             $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent('ok');
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function closeTabAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $id = $this->request->getPost('id');
            $tabId = $this->request->getPost('tabId');
            $nextActive = $this->request->getPost('nextActiveTab');
            $tabs = Tabs::findFirst(array("id = '$id'", "tab_id = '$tabId'"));
            if ($tabs != false) {
                if ($tabs->delete() == false) {
                    echo "Sorry, we can't delete the robot right now: \n";
                        $message = $tabs->getMessages();
                        $this->response->setJsonContent(array($message[0]->__toString()));
                        return $this->response;
                } else {
                    $changeActiveStatus = Tabs::findFirst(array("tab_id = '$nextActive'"));
                    $changeActiveStatus->setActive(1)->save();
                    $this->response->setContentType('application/json', 'UTF-8');
                    $this->response->setJsonContent('ok');
                    return $this->response;
                }
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function changeTabNameAction(){
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $prName= $this->request->getPost('prName');
            $catId= $this->request->getPost('categoryId');
            $kimId= $this->request->getPost('kimId');
            $metallId= $this->request->getPost('metallId');
            $product = Products::findFirst(array("product_id = '$prId'"));
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $product->setProductName($prName)
                        ->setCategoryId($catId)
                        ->setKim($kimId)
                        ->setMetall($metallId)
                        ->save();
                $this->response->setContentType('application/json', 'UTF-8');
                $this->response->setJsonContent('ok');

                return $this->response;
            }
        } else {
            $this->response->redirect('');
        }
    }    
}


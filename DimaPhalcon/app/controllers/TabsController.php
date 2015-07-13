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
                        $this->response->setContentType('application/json', 'UTF-8');
                        $this->response->setJsonContent(array($tabsLi, $active, $prodId, $tabObj));

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
                $category = Categories::find();
                $categoriesList = '';
                if ($category == false) {
                    echo "Мы не можем сохранить робота прямо сейчас: \n";
                    foreach ($category->getMessages() as $message) {
                        echo $message, "\n";
                    }
                } else {
                    foreach ($category as $val) {
                        if ($val->getCategoryId() === $productCatId) {
                            $categoriesList .= '<option selected="selected" name="'.$val->getCategoryId().'">'.$val->getCategoryName().'</option>';
                        } else {
                            $categoriesList .= '<option name="'.$val->getCategoryId().'">'.$val->getCategoryName().'</option>';
                        }

                    }
                }
                $formHelpArr = '';
                $formulasHelper = FormulasHelper::find();
                foreach ( $formulasHelper as $val) {
                    $formHelpArr .= '<span><button type="button" class="btn custom-addRowsToTable btn-xs fhBtn">'. $val->getName().
                        '<span class="glyphicon glyphicon-remove removeFhBtn" aria-hidden="true"></span></button></span>';
                }
                $tabContArr = [];
                $tableRes = '';
                $table = json_decode($product->getTableContent());
                foreach ($table as $key => $val) {
                    foreach ($val as $k => $v) {
                        $tabContArr[$k] = $v;
                    }
                    $tableRes .= $substObj->subHTMLReplace('tableContent.html', $tabContArr);
                    $tabContArr = [];
                }
                $alwArr = [];
                $alwRes = '';
                $alwaysInTable = json_decode($product->getAlwaysintable());
                foreach ($alwaysInTable as $key => $val) {
                    foreach ($val as $k => $v) {
                        $alwArr[$k] = $v;
                    }
                    $alwRes .= $substObj->subHTMLReplace('alwaysInTable.html', $alwArr);
                    $alwArr = [];
                }
                $prName = $product->getProductName();
                if ('Новое изделие' === $prName) {
                    $prName = '';
                }
                $productDetails = array(
                    '%PRODUCT_NAME%' => $prName,
                    '%CATEGORIES%' => $categoriesList,
                    '%CREATED%' => $product->getCreated(),
                    '%TABLE_CONTENT%' => $tableRes,
                    '%ALWAYS_IN_TABLE%' => $alwRes,
                    '%FORMULAS_HELPER%' => $formHelpArr,
                    '%FORMULAS%' => $product->getFormulas()
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
            $productId = '';
            $alwaysInTable = file_get_contents('files/alwaysInTable.json');
            $product = new Products();
            $product->setProductName('Новое изделие')
                    ->setCategoryId($categoryId)
                    ->setAlwaysintable($alwaysInTable)
                    ->setCreated(new RawValue('default'));
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
            $product = Products::findFirst(array("product_id = '$prId'"));
            if ($product == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($product->getMessages() as $message) {
                    echo $message, "\n";
                }
            } else {
                $product->setProductName($prName)
                        ->setCategoryId($catId)
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


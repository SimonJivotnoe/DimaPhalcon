<?php
use Phalcon\Db\RawValue;

class TabsController extends ControllerBase
{
    public function getTabsAction () {
        $this->ajaxGetCheck();
        $data = [];
        $activeTab = false;
        $tabsObj = Tabs::find();
        if ($tabsObj && count($tabsObj)) {
            foreach ($tabsObj as $tab) {
                $active = '';
                if ($tab->getActive()) {
                    $activeTab = $tab->getActive();
                    $active = 'active';
                }
                $template = [
                    'tabId' => $tab->getId(),
                    'isActiveTab' => $active,
                    'productId' => $tab->getProductId(),
                    'productName' => $tab->Products->getProductName(),
                    'productArticle' => $tab->Products->getArticle()
                ];
                array_push($data, $template);
            }
        }

        return $this->response->setJsonContent(['data' => $data, 'activeTab' => $activeTab]);
    }

    public function getLeftTabsListAction() {
        $this->ajaxGetCheck();
        $res = ['success' => false];
        $tabs = Tabs::find();
        if ($tabs) {
            $active = false;
            $prodId = false;
            $tabArr['dbProductsListTab'] = (object)[
                'active' => '',
                'productId' => 'dbProductsListTab'
            ];
            $resObj = [];
            if (count($tabs)) {
                $template = [];    
                foreach ($tabs as $val) {
                    $tabTemplate = [];
                    $id = $val->getId();
                    $tabId = $val->getTabId();
                    $productId = $val->getProductId();
                    $getActive = $val->getActive();
                    $article = $val->Products->getArticle();
                    $status = $val->Products->getStatus();

                    $product = Products::findFirst($productId);
                    $tabTemplate['active'] = '';
                    if ($getActive) {
                        $tabTemplate['active'] = 'active';
                        $active = $tabId;
                        $prodId = $productId;
                    }
                    $tabTemplate['id'] = $id;
                    $tabTemplate['tabId'] = $tabId;
                    $tabTemplate['productId'] = $productId;
                    $tabTemplate['productName'] = $product->getProductName();

                    $tabArr[$tabId] = /*(object)*/[
                        'active'    => $getActive,
                        'productId' => $productId,
                        'article'   => $article,
                        'status'    => $status
                    ];
                    array_push($template, $tabTemplate);
                }
                $kim = Kim::find();
                foreach ($kim as $val) {
                    $resObj[$val->getKim()] = $val->getKimHard();
                }                
            }
            $formulaHelperObj = new FormulasController;
            $res = [
                'success'        => true,
                'template'        => $template,
                'activeTabId'    => $active,
                'productId'      => $prodId,
                'tabsList'       => /*(object)*/$tabArr,
                'kim'            => /*(object)*/$resObj,
                'formulasHelper' => $formulaHelperObj->createFormulaHelperList()
            ];
        }
        
        return $this->response->setJsonContent($res);
    }
    
    public function getLeftTabContentAction($productId) {
        $this->ajaxGetCheck();
        $res = ['status' => false];
        $sector = $this->request->get('sector');
        $product = Products::findFirst($productId);
        if ($product) {
            $productMetall = $product->getMetall();
            $articleFlag = true;
            $tabContent = '';
            $addToOrder = '<span>Добавить в ордер можно только после создания артикула</span>';
            $mainTemplate = 'tabContent.html';
            $tableTemplate = 'tableContent.html';
            $alwaysInTableTemplate = 'alwaysInTable.html';
            $substObj = new Substitution();
            $article = $product->getArticle();
            $alwaysInTable = json_decode($product->getAlwaysintable());
            if (!$article) {
                $articleFlag= false;
                $article = $this->getArticleTemplate();
            } else {
                $orderObj = new OrderController;
                $addToOrder = $orderObj->createAddToOrder();
                $mainTemplate = 'leftTabContentArticle.html';
                if ($sector) {
                    $mainTemplate = 'leftTabContentArticleOrder.html';
                }
                $tableTemplate = 'alwaysInTableArticle.html';
                $alwaysInTableTemplate = 'alwaysInTableArticle.html';
                $metallHistoryObj = new MetallsController();
                $metallHistory = $metallHistoryObj->getMetallHistory($productMetall);
            }

            $prName = $product->getProductName();
            if ('Новое изделие' === $prName) {
                $prName = '';
            }
            $productCatId = $product->getCategoryId();
            $productKim = $product->getKim();
            $table = json_decode($product->getTableContent());

            $productObj = new ProductsController;
            $categoryObj = new CategoriesController;
            $kimObj = new KimController;
            $metallsObj = new MetallsController;
            $formulaHelperObj = new FormulasController;
            $css = '';
            $prStatus = $product->getStatus();
            if ('draft' === $prStatus) {
                $prStatus = '<button type="button" class="btn btn-danger btn-sm" id="saveInDB">Сохранить в БД</button>';
            } else if ('save' === $prStatus){
                $prStatus = 'Сохранено в базе данных' ;
                $css = 'saveInDB';
            } else if ('order') {
                $prStatus = '' ;
                $css = 'addedToOrder';
            }
            $image = '';
            if (null !== $product->getImage()) {
                $date = new DateTime();
                $image = '<div id="productPicture"><img src="img/' . $product->getImage() . '?' . $date->getTimestamp() .'" style="max-width: 100%; max-height: 200px;"></div>';
            }
            $categoriesList = $categoryObj->createCategoriesList($productCatId, $articleFlag);
            $kimList = $kimObj->createKimList($productKim, $articleFlag);
            $metallList = $metallsObj->createMetallsList($productMetall, $articleFlag);
            $detailsForArticle = array(
                'category' => $categoriesList['article'],
                'kim' => $kimList['article']
            );
            $formulas = json_decode($product->getFormulas());

            $productDetails = array(
                '%PRODUCT_NAME%'      => $prName,
                '%ARTICLE_BTN%'       => $article,
                '%IMAGE%'             => $image,
                '%CATEGORIES%'        => $categoriesList['html'],
                '%KIM_LIST%'          => $kimList['html'],
                '%METALL_LIST%'       => $metallList['html'],
                '%CREATED%'           => $product->getCreated(),
                '%SAVE_IN_DB%'        => $prStatus,
                '%TABLE_CONTENT%'     => $productObj->createTableRes($table, $tableTemplate),
                '%TABLE_CONTENT_A%'   => $productObj->createTableRes($table, 'tableContent.html'),
                '%ALWAYS_IN_TABLE%'   => $productObj->createTableRes($alwaysInTable, $alwaysInTableTemplate),
                '%ALWAYS_IN_TABLE_A%' => $productObj->createTableRes($alwaysInTable, 'alwaysInTable.html'),
                '%FORMULAS_HELPER%'   => $formulaHelperObj->createFormulaHelperList(),
                '%FORMULAS%'          => $formulaHelperObj->createFormulasList($formulas),
                '%ADD_TO_ORDER%'      => $addToOrder,
                '%METALL_HISTORY%'    => $metallHistory
            );

            $tabContent .= $substObj->subHTMLReplace($mainTemplate, $productDetails);
            $res = [
                'html'              => $tabContent,
                'article'           => $articleFlag,
                'css'               => $css,
                'detailsForArticle' => (object)$detailsForArticle,
                'metallId'          => $productMetall,
                'image'             => $image
            ];
        }
        $this->response->setJsonContent($res);
        
        return $this->response;
    }
    
    public function getLastLeftTabAction() {
        $this->ajaxGetCheck();
        $res = array();
        $tabs = Tabs::maximum(array("column" => "id"));
        if (!empty($tabs)) {
            $res = $tabs;
        }
        $this->response->setJsonContent($res);
        
        return $this->response;
    }
    
    public function changeActiveLeftTabAction() {
        $this->ajaxPostCheck();
        $res = false;
        $tabs = Tabs::find("active = 1");
        if ($tabs == true) {
            foreach ($tabs as $val) {
                $val->setActive(0);
                $val->save();
            }
            $id = $this->request->getPost('id');
            if ($id) {
                $tabs = Tabs::findFirst($id);
                $tabs->setActive(1)->save();
                if ($tabs->save()) {
                    $res = true;
                }
            }
        }
        $this->response->setJsonContent($res);

        return $this->response;
    }

    public function addNewLeftTabAction($id) {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tab = new Tabs();
            $categoryId = Categories::minimum(array("column" => "category_id"));
            if (empty($categoryId)) {
                $category = new Categories();
                $category->setCategoryName('Нераспределенное');
                $category->save();
                $categoryId = Categories::minimum(array("column" => "category_id"));
            }
            $kimId = Kim::minimum(array("column" => "kim_id"));
            if (empty($kimId)) {
                $kim = new Kim();
                $kim->setKimHard('Прямой участок')
                        ->setKim('1.1')
                        ->save();
                $kimId = Kim::minimum(array("column" => "kim_id"));
            }
            $metallId = Metalls::minimum(array("column" => "id"));
            if (empty($metallId)) {
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
                    ->setArticle(new RawValue('default'))
                    ->setCategoryId($categoryId)
                    ->setKim($kimId)
                    ->setMetall($metallId)
                    ->setAlwaysintable($alwaysInTable)
                    ->setCreated(new RawValue('default'))
                    ->setStatus(new RawValue('default'))
                    ->setTemplate(new RawValue('default'))
                    ->setImage(new RawValue('default'));
            //$product->setTableContent(new RawValue('default'));
            if ($product->save() == false) {
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

            $tab->setTabId('pr' . $id)
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
    
    public function openSavedProductAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $arr = $this->request->getPost('arr');
            $tab = $this->request->getPost('tab');
            $active = $this->request->getPost('active');
            $this->response->setContentType('application/json', 'UTF-8');
            foreach ($arr as $id) {
                $prId = $id;
                $tabs = Tabs::findFirst(array("product_id = '$prId'"));
                if ($tabs) {
                    continue;
                }
                if ('new' === $tab) {
                    $tabObj = new Tabs();
                    $tabId = Tabs::maximum(array("column" => "id"));
                    $tabs = Tabs::find("active = 1");
                    $activeMark = 0;
                    if ('true' === $active) {
                        foreach ($tabs as $val) {
                            $val->setActive(0);
                            $val->save();
                        }
                        $activeMark = 1;
                    }
                    $tabObj->setTabId('pr' . $tabId)
                        ->setProductId($prId)
                        ->setActive($activeMark)
                        ->save();
                } else {
                    $tabs = Tabs::findFirst(array("tab_id = '$tab'"));
                    $tabs->setProductId($prId)
                         ->save();
                }
            }

            $this->response->setJsonContent(true);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function closeTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $id = $this->request->getPost('id');
            $tabId = $this->request->getPost('tabId');
            $nextActive = $this->request->getPost('nextActiveTab');
            $tabs = Tabs::findFirst(array("id = '$id'", "tab_id = '$tabId'"));
            $productObj = Products::findFirst($tabs->getProductId());
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent(false);
            if ($tabs != false) {
                if ($tabs->delete() == false) {
                    echo "Sorry, we can't delete the robot right now: \n";
                    $message = $tabs->getMessages();
                    $this->response->setJsonContent(array($message[0]->__toString()));
                    return $this->response;
                } else {
                    'draft' === $productObj->getStatus() ? $productObj->delete() : true ;
                    if ('dbProductsListTab' !== $nextActive) {
                        $changeActiveStatus = Tabs::findFirst(array("tab_id = '$nextActive'"));
                        $changeActiveStatus->setActive(1)->save();
                    }
                    $this->response->setJsonContent(true);
                }
                return $this->response;
            }
            
        } else {
            $this->response->redirect('');
        }
    }

    public function closeRightTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $id = $this->request->getPost('tabId');
            $orderID = $this->request->getPost('orderID');
            $nextActive = $this->request->getPost('nextActiveTab');
            $this->response->setContentType('application/json', 'UTF-8');
            $tabs = TabsRight::findFirst(array("id = '$id'", "order_id = '$orderID'"));
            $orderObj = Orders::findFirst($orderID);
            if ($tabs != false) {
                if ($tabs->delete() == false) {
                    echo "Sorry, we can't delete the robot right now: \n";
                    $message = $tabs->getMessages();
                    $this->response->setJsonContent(array($message[0]->__toString()));
                    return $this->response;
                } else {
                    $changeActiveStatus = TabsRight::findFirst(array("id = '$nextActive'"));
                    if (false !== $changeActiveStatus) {
                        $changeActiveStatus->setActive(1)->save();
                    }
                    if ('draft' === $orderObj->getStatus()) {
                        if ('TRUE' === $orderObj->getConsolidate()) {
                            $consObj = ConsolidateOrders::find(array("order_id = '$orderID'"));
                            foreach ($consObj as $obj) {
                                $obj->delete();
                            }
                        } else {
                            $prInOrderObj = Productinorder::find(array("orderId = '$orderID'"));
                            foreach ($prInOrderObj as $obj) {
                                $obj->delete();
                            }
                        }
                        $orderObj->delete();
                    }
                    $this->response->setJsonContent('ok');
                    return $this->response;
                }
            }
        } else {
            $this->response->redirect('');
        }
    }

    public function changeTabNameAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $prId = $this->request->getPost('prId');
            $prName = $this->request->getPost('prName');
            $catId = $this->request->getPost('categoryId');
            $kimId = $this->request->getPost('kimId');
            $metallId = $this->request->getPost('metallId');
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

    public function getRightTabsListAction() {
        $this->ajaxGetCheck();
        $tabs = TabsRight::find();
        if ($tabs == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($tabs->getMessages() as $message) {
                echo $message, "\n";
            }
        } else {
            //$this->response->setContentType('application/json', 'UTF-8');
            if (count($tabs)) {
                $active = 'fileManagerOrdersTab';
                $orderId = '';
                $tabsLi = '';
                $tabArr = array();
                $substObj = new Substitution();
                foreach ($tabs as $val) {
                    $tabsList = array();
                    if ($val->getActive()) {
                        $tabsList['%ACTIVE%'] = 'active';
                        $active = 'or' . $val->getId();
                        $orderId = $val->getOrderId();
                    } else {
                        $tabsList['%ACTIVE%'] = '';
                    }
                    $tabsList['%ID%'] = 'or' . $val->getId();
                    $tabsList['%TABID%'] = $val->getId();
                    $tabsList['%ORDER_ID%'] = $val->getOrderId();
                    $order = Orders::findFirst($val->getOrderId());
                    $tabsList['%ORDER_NAME%'] = $order->getArticle();
                    $tabsLi .= $substObj->subHTMLReplace('tab_li_right.html', $tabsList);

                    $tabArr['fileManagerOrdersTab'] = (object)[
                        'active' => '',
                        'orderId' => 'fileManagerOrdersTab'
                    ];
                    $tabArr['or' . $val->getId()] = (object) [
                        'active'  => $val->getActive(),
                        'orderId' => $val->getOrderId()
                    ];
                }
                $this->response->setJsonContent([
                    'tabs'    => true,
                    'tabId'   => $active,
                    'orderId' => $orderId,
                    'obj'     => (object) $tabArr,
                    'html'    => $tabsLi
                    ]
                );
                return $this->response;
            }

            $this->response->setJsonContent(array(false));

            return $this->response;
        }
    }

    public function getRightTabContentOrderDetailsAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $orderId = $this->request->get('orderId', 'int');
            $this->response->setContentType('application/json', 'UTF-8');
            $order = Orders::findFirst($orderId);
            if ($order == false) {
                $this->response->setJsonContent(['success' => false, 'error' => __METHOD__ . ':' . $order->getMessages()]);
                return $this->response;
            }
            $substObj = new Substitution();

            $orderObj = new OrderController();
            $orderDescription = $orderObj->getOrderDescriptionObj();
            $rows = $orderDescription;
            $status = $order->getStatus();
            'draft' === $status
                ? $rows['%SAVE_ORDER_IN_DB%'] = '<button type="button" class="btn btn-danger btn-sm" id="saveOrderInDB">Сохранить в БД</button>'
                : $rows['%SAVE_ORDER_IN_DB%'] = 'Сохранено в базе данных';
            $rows['%ORDER_NAME%'] = $order->getArticle();
            $rows['%DELETE_ORDER%'] = '<button type="button" class="btn btn-danger btn-sm" id="deleteOrder">Удалить Ордер</button>';
            if ('TRUE' === $order->getConsolidate()) {
                $rows['%DELETE_ORDER%'] = '';
                $rows['%SAVE_ORDER_IN_DB%'] = '';
            }
            $discount = $order->getDiscount();
            $rows['%DISCOUNT%'] = $discount;
            $res = $substObj->subHTMLReplace('rightTabContent.html', $rows);
            $this->response->setJsonContent(['success' => true, 'html' => $res, 'orderDescription' => $orderDescription, 'consolidate' => $order->getConsolidate()]);

            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function getRightTabContentTableAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $orderId = $this->request->get('orderId');
            $this->response->setContentType('application/json', 'UTF-8');
            $order = Orders::findFirst($orderId);
            if ($order == false) {
                echo "Мы не можем сохранить робота прямо сейчас: \n";
                foreach ($order->getMessages() as $message) {
                    echo $message, "\n";
                }
                return false;
            }
            $substObj = new Substitution();
            $consolidateData = false;
            if ('TRUE' === $order->getConsolidate()) {
                $consolidateData = [];
                if (null === $order->getMap()) {
                    
                }
                $consolidateOrdersObj = ConsolidateOrders::find(array("order_id = '$orderId'"));
                if (false !== $consolidateOrdersObj) {
                    foreach ($consolidateOrdersObj as $val) {
                        $consOrderId = $val->getConsOrderId();
                        $orderObj = Orders::findFirst($consOrderId);
                        if (false !== $orderObj) {
                            $consolidateData[$consOrderId] = ['map' => json_decode($orderObj->getMap())];
                            $consolidateData[$consOrderId]['products'] = [];
                            $prInOrder = Productinorder::find(array("orderId = '$consOrderId'"));
                            if (false !== $prInOrder) {
                                foreach ($prInOrder as $obj) {
                                    $alwaysInTable = json_decode($obj->getAlwaysInTable());
                                    $prId = $obj->getProductId();
                                    $consolidateData[$consOrderId]['products'][$prId] = [
                                        'inSum' => $alwaysInTable->{'3'}->{'%INPUT_VALUE%'},
                                        'outSum' => $alwaysInTable->{'5'}->{'%INPUT_VALUE%'},
                                        'inPrice' => $alwaysInTable->{'2'}->{'%INPUT_VALUE%'},
                                        'outPrice' => $alwaysInTable->{'4'}->{'%INPUT_VALUE%'}
                                    ];
                                    $prDetObj = Products::findFirst(array("product_id = '$prId'"));
                                    if (false !== $prDetObj) {
                                        $metallId = $prDetObj->getMetall();
                                        $metallObj = Metalls::findFirst($metallId);
                                        $consolidateData[$consOrderId]['products'][$prId]['article'] = $prDetObj->getArticle();
                                        $consolidateData[$consOrderId]['products'][$prId]['productName'] = $prDetObj->getProductName() . ' из ' . $metallObj->getName();
                                    }
                                }
                            }
                        }
                    }
                }
            } 
            $res = array('%SECTIONS%' => '', '%WITHOUT_SECTIONS%' => '');
            $map = json_decode($order->getMap());
            $moveTo = array();
            $productObj = new ProductsController;
            $currentSection = '';
            if ('' !== $map && null !== $map) {
                $orderObj = new OrderController;
                foreach ($map as $key => $val) {
                    if ('out' === $key && count($val)) {
                        $i = 1;
                        foreach ($val as $num => $obj) {
                            foreach ($obj as $productId => $quantity) {
                                $res['%WITHOUT_SECTIONS%'] .= $productObj->createProductInOrder($productId, $quantity, $orderId, $i, 'withoutSectionRow', $map, 'out');
                            }
                            $i++;
                        }
                    } else if ('out' !== $key) {
                        if (!count($val)) {
                            $currentSection = $key;
                        }
                        $res['%SECTIONS%'] .= '<tr class="orderTableSectionName" name="' . $key . '">
                    <th colspan="9"><span class="orderSectionName" contenteditable="true">' . $key . '</span></th><td><span class="glyphicon glyphicon-remove removeRowSection" name="' . $key . '" aria-hidden="true"></span></td></tr>';
                        if (count($val)) {
                            $i = 1;
                            foreach ($val as $num => $obj) {
                                foreach ($obj as $productId => $quantity) {
                                    $res['%SECTIONS%'] .= $productObj->createProductInOrder($productId, $quantity, $orderId, $i, 'orderTableSection', $map, $key);
                                }
                                $i++;
                            }
                        } else if (!count($val)) {
                            $moveTo[$key] = array();
                        }
                    }
                }
            }
            $this->response->setJsonContent(['html' => $substObj->subHTMLReplace('orderTable.html', $res), 'success' => true, 'consolidateData' => $consolidateData]);
            /*if ('FALSE' === $order->getConsolidate()) {
            } else {
                $this->response->setJsonContent(['html' => 'test', 'success' => true]);
            }*/
            return $this->response;

        } else {
            $this->response->redirect('');
        }
    }
    
    public function changeActiveRightTabAction() {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $tabs = TabsRight::find("active = 1");
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
                $tabs = TabsRight::find(array("id = '$id'"));
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

    private function getArticleTemplate() {
        return '<p>
                    <button type="button" class="btn btn-info btn-sm" id="createArticle">Создать артикул</button>
                    <button type="button" class="btn btn-success btn-sm" id="saveArticle">Сохранить</button>
                    <button type="button" class="btn btn-danger btn-sm" id="cancelArticleBtn">Отмена</button>
                    <span id="errorArticle" class="bg-danger"></span>
                </p>';
    }

    public function addNewRightTab($order_id) {
        $tabActive = TabsRight::find(array("active = 1"));
        foreach ($tabActive as $val) {
            $val->setActive(0);
            $val->save();
        }
        if ($tabActive == false) {
            echo "Мы не можем сохранить робота прямо сейчас: \n";
            foreach ($tabActive->getMessages() as $message) {
                echo $message, "\n";
            }
        } else {
            
        }
        $tab = new TabsRight;
        $tab->setOrderId($order_id)
                ->setActive('1')
                ->save();
        if ($tab == false) {
            return false;
        }

        return $order_id;
    }

}

<?php

use Phalcon\Db\RawValue;

class ClientsController  extends \Phalcon\Mvc\Controller 
{
    public function getClientsTreeAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $tree = [];
            $clientObj = Clients::find();
            $i = 1;
            if (count($clientObj)) {
                foreach ($clientObj as $val) {
                    $clientId = $val->getId();
                    $node = [
                        'label'    => $val->getFio() . ' | ' . $val->getCompanyName(),
                        'id'       => $i,
                        'clientId' => $clientId,
                        'sector'   => 'client',
                        'children' => [],
                        'info'     => [
                            'fio'          => $val->getFio(),
                            'appeal'       => $val->getAppeal(),
                            'company_name' => $val->getCompanyName(),
                            'adress'       => $val->getAdress(),
                            'accaunt'      => $val->getAccaunt(),
                            'zip'          => $val->getZip()
                        ]
                    ];

                    if (count($val->Projects)) {
                        foreach ($val->Projects as $prVal) {
                            $i++;
                            $projectId = $prVal->getId();
                            $node2 = [
                                'label'     => $prVal->getName(),
                                'id'        => $i,
                                'projectId' => $projectId,
                                'clientId'  => $clientId,
                                'sector'    => 'project',
                                'children'  => [],
                                'info'      => [
                                    'name'        => $prVal->getName(),
                                    'description' => $prVal->getDescription(),
                                    'estimate'    => $prVal->getEstimate(),
                                    'date'        => $prVal->getDate()
                                ]
                            ];
                            $ordersObj = Orders::find(
                                            "project = '" . $projectId . "' AND status = 'save' AND consolidate != 'TRUE'"
                            );
                            if (count($ordersObj)) {
                                foreach ($ordersObj as $orVal) {
                                    $i++;
                                    $orderId = $orVal->getId();
                                    $child = [
                                        'label'     => $orVal->getArticle(),
                                        'sector'    => 'order',
                                        'id'        => $i,
                                        'clientId'  => $clientId,
                                        'projectId' => $projectId,
                                        'orderId'   => $orderId,
                                        'inTab'     => false,
                                        'info'      => [
                                            'article' => $orVal->getArticle()
                                        ]
                                    ];
                                    if (TabsRight::findFirst(array("order_id = '$orderId'"))) {
                                        $child['inTab'] = true;
                                    }
                                    array_push($node2['children'], (object) $child);
                                }
                            }
                            array_push($node['children'], (object) $node2);
                        }
                    }
                    array_push($tree, (object) $node);
                    $i++;
                }
            }
            $this->response->setJsonContent(['tree' => $tree]);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function getClientsDescriptionObjAction() {
        if ($this->request->isAjax() && $this->request->isGet()) {
            $clients = Clients::find();
            if ($clients == false) {
                return false;
            }
            $clientsDescription = [
                'fio'          => [],
                'appeal'       => [],
                'company_name' => [],
                'adress'       => [],
                'accaunt'      => [],
                'zip'          => [],
                'name'         => [],
                'description'  => []
            ];
            foreach ($clients as $val) {
                array_push($clientsDescription['fio'], $val->getFio());
                array_push($clientsDescription['appeal'], $val->getAppeal());
                array_push($clientsDescription['company_name'], $val->getCompanyName());
                array_push($clientsDescription['adress'], $val->getAdress());
                array_push($clientsDescription['accaunt'], $val->getAccaunt());
                array_push($clientsDescription['zip'], $val->getZip());
            }
            $projects = Projects::find();
            if (count($projects)) {
                foreach ($projects as $val) {
                    array_push($clientsDescription['name'], $val->getName());
                    array_push($clientsDescription['description'], $val->getDescription());
                }

            }
            $this->response->setContentType('application/json', 'UTF-8');
            $this->response->setJsonContent($clientsDescription);
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function addNewClientAction () {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $client = new Clients();
            $success = $client->save($this->request->getPost(), array(
                'fio', 'appeal', 'company_name', 'adress', 'accaunt', 'zip'
            ));

            if ($success) {
                $this->response->setJsonContent(true);
            } else {
                $this->response->setJsonContent(false);
            }
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function updateClientAction () {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $client = Clients::findFirst($this->request->getPost('id'));
            $success = $client->save($this->request->getPost(), array(
                'fio', 'appeal', 'company_name', 'adress', 'accaunt', 'zip'
            ));
            $this->response->setJsonContent($success);
            
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function deleteClientAction () {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $client = Clients::findFirst($this->request->getPost('id'));
            $res = false;
            $orderObj = new OrderController();
            $ordersArr = [];
            if (count($client)) {
                if (count($client->Projects)) {
                    foreach ($client->Projects as $project) {
                        if (count($project->Orders)) {
                            foreach ($project->Orders as $order) {
                                array_push($ordersArr, $order->getId());
                                $orderObj->deleteProductsFromOrder($order->getId());
                                $orderObj->deleteOrderFromTabs($order->getId());
                                $order->delete();
                            }
                        }
                        $project->delete();
                    }
                }
                $res = $client->delete();
            }
            $this->response->setJsonContent(array('res' => $res, 'orders' => $ordersArr));
            
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
}
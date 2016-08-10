<?php

use Phalcon\Db\RawValue;

class ClientsController  extends ControllerBase
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
                                            //"project = '" . $projectId . "' AND status = 'save' AND consolidate != 'TRUE'"
                                            "project = '" . $projectId . "'"
                            );
                            if (count($ordersObj)) {
                                foreach ($ordersObj as $orVal) {
                                    $consolidate = $orVal->getConsolidate();
                                    $i++;
                                    $orderId = $orVal->getId();
                                    $child = [
                                        'label'       => ('TRUE' === $consolidate ? 'K': '') . $orVal->getArticle(),
                                        'sector'      => 'order',
                                        'id'          => $i,
                                        'clientId'    => $clientId,
                                        'projectId'   => $projectId,
                                        'orderId'     => $orderId,
                                        'consolidate' => $consolidate,
                                        'inTab'       => false,
                                        'info'        => [
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
        $this->ajaxPostCheck();
        $msg = 'Ощибка при создании Клиента.';
        $client = new Clients();
        $success = $client->save($this->request->getPost(), array(
            'fio', 'appeal', 'company_name', 'adress', 'accaunt', 'zip'
        ));

        if ($success) {
            $msg = 'Клиент успешно создан.';
        }
        
        return $this->response->setJsonContent(['success' => $success, 'msg' => $msg]);
    }
    
    public function updateClientAction () {
        $this->ajaxPostCheck();
        $client = Clients::findFirst($this->request->getPost('id'));
        $msg = 'Ошибка при обновлении Клиента.';
        if ($client) {
            $success = $client->save($this->request->getPost(), array(
                'fio', 'appeal', 'company_name', 'adress', 'accaunt', 'zip'
            ));
            if ($success) {
                $msg = 'Информация обновлена';
            }
        }
        
        return $this->response->setJsonContent(['success' => $success, 'msg' => $msg]);
    }
    
    public function deleteClientAction ($clientId) {
        //$this->response->setJsonContent(array('res' => $res, 'orders' => array_merge(...$ordersArr)));
        $this->ajaxDeleteCheck();
        $success = false;
        $msg = 'Ошибка при удалении Клиента!';
        $client = Clients::findFirst($clientId);
        $ordersArr = [];
        if (count($client)) {
            if (count($client->Projects)) {
                $projectObj = new ProjectsController();
                foreach ($client->Projects as $project) {
                    array_push($ordersArr, $projectObj->deleteProject($project)['orders']);
                }
            }
            try {
                if ($client->delete()) {
                    $success = true;
                    $msg = 'клиент успешно удален';
                }
            } catch (\Exception $e) {

            }
        }

        return $this->response->setJsonContent(['success' => $success, 'msg' => $msg]);
    }
}
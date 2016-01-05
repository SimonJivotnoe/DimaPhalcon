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
                                    $child = [
                                        'label'     => $orVal->getArticle(),
                                        'sector'    => 'order',
                                        'id'        => $i,
                                        'clientId'  => $clientId,
                                        'projectId' => $projectId,
                                        'orderId'   => $orVal->getId(),
                                        'info'      => [
                                            'article' => $orVal->getArticle()
                                        ]
                                    ];
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
            if (count($client)) {
                if (count($client->Projects)) {
                    foreach ($client->Projects as $project) {
                        if (count($project->Orders)) {
                            foreach ($project->Orders as $order) {
                                $order->delete();
                            }
                        }
                        $project->delete();
                    }
                    $res = $client->delete();
                }
            }
            $this->response->setJsonContent($res);
            
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function updateProjectAction () {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $client = Projects::findFirst($this->request->getPost('id'));
            $success = $client->save($this->request->getPost(), array(
                'name', 'description', 'estimate', 'date'
            ));
            $this->response->setJsonContent($success);
            
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }
    
    public function deleteProjectAction () {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $project = Projects::findFirst($this->request->getPost('id'));
            $res = false;
            if (count($project)) {
                if (count($project->Orders)) {
                    foreach ($project->Orders as $order) {
                        $order->delete();
                    }
                }
                $res = $project->delete();
            }
            $this->response->setJsonContent($res);
            
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

}
<?php

use Phalcon\Db\RawValue;

class ProjectsController  extends \Phalcon\Mvc\Controller 
{
    public function addNewProjectAction () {
        if ($this->request->isAjax() && $this->request->isPost()) {
            $this->response->setContentType('application/json', 'UTF-8');
            $client = new Projects();
            $success = $client->save($this->request->getPost(), array(
                'name', 'description', 'estimate', 'date', 'client'
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
                $res = $this->deleteProject($project)['res'];
            }
            $this->response->setJsonContent($res);
            
            return $this->response;
        } else {
            $this->response->redirect('');
        }
    }

    public function deleteProject($project)
    {
        $ordersArr = [];
        if (count($project->Orders)) {
            $orderObj = new OrderController();
            foreach ($project->Orders as $order) {
                $orderId = $order->getId();
                array_push($ordersArr, $orderId);
                $orderObj->deleteFromConsolidateOrder($orderId);
                $orderObj->deleteProductsFromOrder($orderId);
                $orderObj->deleteOrderFromTabs($orderId);
                $orderObj->deleteFromConsolidateOrder($orderId);
                $order->delete();
            }
        }
        return ['res' => $project->delete(), 'orders' => $ordersArr];
    }
}
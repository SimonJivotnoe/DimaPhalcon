<?php

use Phalcon\Db\RawValue;

class ProjectsController  extends ControllerBase
{
    public function addNewProjectAction () {
        $this->ajaxPostCheck();
        $msg = 'Ощибка при создании Проекта.';
        $project = new Projects();
        $success = $project->save($this->request->getPost(), array(
            'name', 'description', 'estimate', 'date', 'client'
        ));
        if ($success) {
            $msg = 'Проект успешно создан.';
        }
        
        return $this->response->setJsonContent(['success' => $success, 'msg' => $msg]);
    }
    
    public function updateProjectAction () {
        $this->ajaxPostCheck();
        $project = Projects::findFirst($this->request->getPost('id'));
        $msg = 'Ошибка при обновлении Проекта.';
        if ($project) {
            $success = $project->save($this->request->getPost(), array(
                'name', 'description', 'estimate', 'date'
            ));
            if ($success) {
                $msg = 'Информация обновлена';
            }
        }
        
        return $this->response->setJsonContent(['success' => $success, 'msg' => $msg]);
    }
    
    public function deleteProjectAction ($projectId) {
        $this->ajaxDeleteCheck();
        $success = false;
        $msg = 'Ошибка при удалении Проекта!';
        $project = Projects::findFirst($projectId);
        if (count($project) && $this->deleteProject($project)['res']) {
            $success = true;
            $msg = 'Проекта успешно удалён';
        }
        
        return $this->response->setJsonContent(['success' => $success, 'msg' => $msg]);
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
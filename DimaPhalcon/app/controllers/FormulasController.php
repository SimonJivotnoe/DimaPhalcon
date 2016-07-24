<?php

class FormulasController extends ControllerBase
{

    public function getFormulasHelperAction() {
        $this->ajaxGetCheck();
        $formulasHelper= [];
        $formulasHelperObj = FormulasHelper::find();
        foreach ( $formulasHelperObj as $val) {
            /*$formHelpList .= '<span><button type="button" class="btn custom-addRowsToTable btn-xs fhBtn">'. $val->getName().
                '<span class="glyphicon glyphicon-remove removeFhBtn" data-id="' . $val->getId() . '" aria-hidden="true"></span></button></span>';*/
            array_push($formulasHelper, ['id' => $val->getId(), 'name' => $val->getName()]);
        }
        $this->response->setJsonContent(['success' => true, 'formulasHelper' => $formulasHelper]);

        return $this->response;
    }

    public function createFormulasList($formulas){
        $formulasRes = '';
        foreach ($formulas as $key => $val) {
            foreach ($val as $k => $v) {
                if ('formula' === $k) {
                    $formulasRes .= '<li class="list-group-item formula"><span class="formulaValue col-md-9">'.$v.'</span>';
                }
                if ('cell' === $k) {
                    if ('' !== $v) {
                        $formulasRes .= '<span class="glyphicon glyphicon-retweet cellBind" aria-hidden="true"> '.$v.'</span>
                        <span class="glyphicon glyphicon-pencil editFormula" aria-hidden="true"></span>
                        <span class="glyphicon glyphicon-remove removeFormula" aria-hidden="true"></span>
                        </li>';
                    } else {
                        $formulasRes .= '<span class="glyphicon glyphicon-resize-small bindFormulaWithCell" aria-hidden="true"></span><span class="addAvailableCellList"></span>'
                            .'<span class="glyphicon glyphicon-pencil editFormula" aria-hidden="true"></span>'
                                . '<span class="glyphicon glyphicon-remove removeFormula" aria-hidden="true"></span>
                                </li>';
                    }
                }
            }
        }
        return $formulasRes;
    }

}


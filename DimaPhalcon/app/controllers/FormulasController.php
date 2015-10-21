<?php

class FormulasController extends \Phalcon\Mvc\Controller
{

    public function createFormulaHelperList()
    {
        $formHelpList = '';
        $formulasHelper = FormulasHelper::find();
        foreach ( $formulasHelper as $val) {
            $formHelpList .= '<span><button type="button" class="btn custom-addRowsToTable btn-xs fhBtn">'. $val->getName().
                '<span class="glyphicon glyphicon-remove removeFhBtn" aria-hidden="true"></span></button></span>';
        }
        return $formHelpList;
    }

    public function createFormulasList($formulas){
        $formulasRes = '';
        foreach ($formulas as $key => $val) {
            foreach ($val as $k => $v) {
                if ('formula' === $k) {
                    $formulasRes .= '<li class="list-group-item formula"><span class="formulaValue">'.$v.'</span>';
                }
                if ('cell' === $k) {
                    if ('' !== $v) {
                        $formulasRes .= '<span class="glyphicon glyphicon-retweet cellBind" aria-hidden="true"> '.$v.'</span>
                        <span class="glyphicon glyphicon-remove removeFormula" aria-hidden="true"></span></li>';
                    } else {
                        $formulasRes .= '<span class="glyphicon glyphicon-remove removeFormula" aria-hidden="true"></span></li>';
                    }
                }
            }
        }
        return $formulasRes;
    }

}


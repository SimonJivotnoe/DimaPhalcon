<?php

class ConsolidateOrders extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     */
    protected $id;

    /**
     *
     * @var integer
     */
    protected $order_id;

    /**
     *
     * @var integer
     */
    protected $cons_order_id;

    /**
     * Method to set the value of field id
     *
     * @param integer $id
     * @return $this
     */
    public function setId($id)
    {
        $this->id = $id;

        return $this;
    }

    /**
     * Method to set the value of field order_id
     *
     * @param integer $order_id
     * @return $this
     */
    public function setOrderId($order_id)
    {
        $this->order_id = $order_id;

        return $this;
    }

    /**
     * Method to set the value of field cons_order_id
     *
     * @param integer $cons_order_id
     * @return $this
     */
    public function setConsOrderId($cons_order_id)
    {
        $this->cons_order_id = $cons_order_id;

        return $this;
    }

    /**
     * Returns the value of field id
     *
     * @return integer
     */
    public function getId()
    {
        return $this->id;
    }

    /**
     * Returns the value of field order_id
     *
     * @return integer
     */
    public function getOrderId()
    {
        return $this->order_id;
    }

    /**
     * Returns the value of field cons_order_id
     *
     * @return integer
     */
    public function getConsOrderId()
    {
        return $this->cons_order_id;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->belongsTo('cons_order_id', '\Orders', 'id', array('alias' => 'Orders'));
        $this->belongsTo('order_id', '\Orders', 'id', array('alias' => 'Orders'));
    }

}

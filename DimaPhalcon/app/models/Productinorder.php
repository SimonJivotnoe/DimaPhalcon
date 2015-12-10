<?php

class Productinorder extends \Phalcon\Mvc\Model
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
    protected $orderId;

    /**
     *
     * @var integer
     */
    protected $productId;

    /**
     *
     * @var string
     */
    protected $always_in_table;

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
     * Method to set the value of field orderId
     *
     * @param integer $orderId
     * @return $this
     */
    public function setOrderid($orderId)
    {
        $this->orderId = $orderId;

        return $this;
    }

    /**
     * Method to set the value of field productId
     *
     * @param integer $productId
     * @return $this
     */
    public function setProductid($productId)
    {
        $this->productId = $productId;

        return $this;
    }

    /**
     * Method to set the value of field always_in_table
     *
     * @param string $always_in_table
     * @return $this
     */
    public function setAlwaysInTable($always_in_table)
    {
        $this->always_in_table = $always_in_table;

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
     * Returns the value of field orderId
     *
     * @return integer
     */
    public function getOrderid()
    {
        return $this->orderId;
    }

    /**
     * Returns the value of field productId
     *
     * @return integer
     */
    public function getProductid()
    {
        return $this->productId;
    }

    /**
     * Returns the value of field always_in_table
     *
     * @return string
     */
    public function getAlwaysInTable()
    {
        return $this->always_in_table;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->belongsTo('orderId', '\Orders', 'id', array('alias' => 'Orders'));
        $this->belongsTo('productId', '\Products', 'product_id', array('alias' => 'Products'));
    }

}

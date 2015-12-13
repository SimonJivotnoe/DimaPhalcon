<?php

class Orders extends \Phalcon\Mvc\Model
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
    protected $order_number;

    /**
     *
     * @var string
     */
    protected $article;

    /**
     *
     * @var string
     */
    protected $discount;

    /**
     *
     * @var string
     */
    protected $order_description;

    /**
     *
     * @var string
     */
    protected $map;

    /**
     *
     * @var string
     */
    protected $status;

    /**
     *
     * @var string
     */
    protected $consolidate;

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
     * Method to set the value of field order_number
     *
     * @param integer $order_number
     * @return $this
     */
    public function setOrderNumber($order_number)
    {
        $this->order_number = $order_number;

        return $this;
    }

    /**
     * Method to set the value of field article
     *
     * @param string $article
     * @return $this
     */
    public function setArticle($article)
    {
        $this->article = $article;

        return $this;
    }

    /**
     * Method to set the value of field discount
     *
     * @param string $discount
     * @return $this
     */
    public function setDiscount($discount)
    {
        $this->discount = $discount;

        return $this;
    }

    /**
     * Method to set the value of field order_description
     *
     * @param string $order_description
     * @return $this
     */
    public function setOrderDescription($order_description)
    {
        $this->order_description = $order_description;

        return $this;
    }

    /**
     * Method to set the value of field map
     *
     * @param string $map
     * @return $this
     */
    public function setMap($map)
    {
        $this->map = $map;

        return $this;
    }

    /**
     * Method to set the value of field status
     *
     * @param string $status
     * @return $this
     */
    public function setStatus($status)
    {
        $this->status = $status;

        return $this;
    }

    /**
     * Method to set the value of field consolidate
     *
     * @param string $consolidate
     * @return $this
     */
    public function setConsolidate($consolidate)
    {
        $this->consolidate = $consolidate;

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
     * Returns the value of field order_number
     *
     * @return integer
     */
    public function getOrderNumber()
    {
        return $this->order_number;
    }

    /**
     * Returns the value of field article
     *
     * @return string
     */
    public function getArticle()
    {
        return $this->article;
    }

    /**
     * Returns the value of field discount
     *
     * @return string
     */
    public function getDiscount()
    {
        return $this->discount;
    }

    /**
     * Returns the value of field order_description
     *
     * @return string
     */
    public function getOrderDescription()
    {
        return $this->order_description;
    }

    /**
     * Returns the value of field map
     *
     * @return string
     */
    public function getMap()
    {
        return $this->map;
    }

    /**
     * Returns the value of field status
     *
     * @return string
     */
    public function getStatus()
    {
        return $this->status;
    }

    /**
     * Returns the value of field consolidate
     *
     * @return string
     */
    public function getConsolidate()
    {
        return $this->consolidate;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany('id', '\ProductInOrder', 'orderId', array('alias' => 'ProductInOrder'));
        $this->hasMany('id', '\Tabs_right', 'order_id', array('alias' => 'Tabs_right'));
    }

}

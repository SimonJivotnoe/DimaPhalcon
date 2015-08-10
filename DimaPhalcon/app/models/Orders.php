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
     * @return string
     */
    public function getOrderNumber()
    {
        return $this->order_number;
    }
    
    /**
     * Returns the value of field article
     *
     * @return integer
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
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany('id', '\ProductInOrder', 'orderId', array('alias' => 'ProductInOrder'));
    }

}

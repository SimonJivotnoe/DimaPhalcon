<?php

class MetallPricesHistory extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     */
    protected $id;

    /**
     *
     * @var string
     */
    protected $price;

    /**
     *
     * @var string
     */
    protected $out_price;

    /**
     *
     * @var string
     */
    protected $date;

    /**
     *
     * @var integer
     */
    protected $metall_id;

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
     * Method to set the value of field price
     *
     * @param string $price
     * @return $this
     */
    public function setPrice($price)
    {
        $this->price = $price;

        return $this;
    }

    /**
     * Method to set the value of field out_price
     *
     * @param string $out_price
     * @return $this
     */
    public function setOutPrice($out_price)
    {
        $this->out_price = $out_price;

        return $this;
    }

    /**
     * Method to set the value of field date
     *
     * @param string $date
     * @return $this
     */
    public function setDate($date)
    {
        $this->date = $date;

        return $this;
    }

    /**
     * Method to set the value of field metall_id
     *
     * @param integer $metall_id
     * @return $this
     */
    public function setMetallId($metall_id)
    {
        $this->metall_id = $metall_id;

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
     * Returns the value of field price
     *
     * @return string
     */
    public function getPrice()
    {
        return $this->price;
    }

    /**
     * Returns the value of field out_price
     *
     * @return string
     */
    public function getOutPrice()
    {
        return $this->out_price;
    }

    /**
     * Returns the value of field date
     *
     * @return string
     */
    public function getDate()
    {
        return $this->date;
    }

    /**
     * Returns the value of field metall_id
     *
     * @return integer
     */
    public function getMetallId()
    {
        return $this->metall_id;
    }

    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->belongsTo('metall_id', '\Metalls', 'id', array('alias' => 'Metalls'));
    }

}

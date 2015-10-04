<?php
use Phalcon\Mvc\Model,
    Phalcon\Validation,
    Phalcon\Mvc\Model\Validator\Uniqueness;

class Products extends \Phalcon\Mvc\Model
{

    /**
     *
     * @var integer
     */
    protected $product_id;

    /**
     *
     * @var string
     */
    protected $article;

    /**
     *
     * @var string
     */
    protected $product_name;

    /**
     *
     * @var integer
     */
    protected $category_id;

    /**
     *
     * @var integer
     */
    protected $kim;

    /**
     *
     * @var integer
     */
    protected $metall;

    /**
     *
     * @var string
     */
    protected $table_content;

    /**
     *
     * @var string
     */
    protected $alwaysInTable;

    /**
     *
     * @var string
     */
    protected $formulas;

    /**
     *
     * @var string
     */
    protected $created;

    /**
     *
     * @var string
     */
    protected $status;

    /**
     *
     * @var string
     */
    protected $template;

    /**
     * Method to set the value of field product_id
     *
     * @param integer $product_id
     * @return $this
     */
    public function setProductId($product_id)
    {
        $this->product_id = $product_id;

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
     * Method to set the value of field product_name
     *
     * @param string $product_name
     * @return $this
     */
    public function setProductName($product_name)
    {
        $this->product_name = $product_name;

        return $this;
    }

    /**
     * Method to set the value of field category_id
     *
     * @param integer $category_id
     * @return $this
     */
    public function setCategoryId($category_id)
    {
        $this->category_id = $category_id;

        return $this;
    }

    /**
     * Method to set the value of field kim
     *
     * @param integer $kim
     * @return $this
     */
    public function setKim($kim)
    {
        $this->kim = $kim;

        return $this;
    }

    /**
     * Method to set the value of field metall
     *
     * @param integer $metall
     * @return $this
     */
    public function setMetall($metall)
    {
        $this->metall = $metall;

        return $this;
    }

    /**
     * Method to set the value of field table_content
     *
     * @param string $table_content
     * @return $this
     */
    public function setTableContent($table_content)
    {
        $this->table_content = $table_content;

        return $this;
    }

    /**
     * Method to set the value of field alwaysInTable
     *
     * @param string $alwaysInTable
     * @return $this
     */
    public function setAlwaysintable($alwaysInTable)
    {
        $this->alwaysInTable = $alwaysInTable;

        return $this;
    }

    /**
     * Method to set the value of field formulas
     *
     * @param string $formulas
     * @return $this
     */
    public function setFormulas($formulas)
    {
        $this->formulas = $formulas;

        return $this;
    }

    /**
     * Method to set the value of field created
     *
     * @param string $created
     * @return $this
     */
    public function setCreated($created)
    {
        $this->created = $created;

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
     * Method to set the value of field template
     *
     * @param string $template
     * @return $this
     */
    public function setTemplate($template)
    {
        $this->template = $template;

        return $this;
    }

    /**
     * Returns the value of field product_id
     *
     * @return integer
     */
    public function getProductId()
    {
        return $this->product_id;
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
     * Returns the value of field product_name
     *
     * @return string
     */
    public function getProductName()
    {
        return $this->product_name;
    }

    /**
     * Returns the value of field category_id
     *
     * @return integer
     */
    public function getCategoryId()
    {
        return $this->category_id;
    }

    /**
     * Returns the value of field kim
     *
     * @return integer
     */
    public function getKim()
    {
        return $this->kim;
    }

    /**
     * Returns the value of field metall
     *
     * @return integer
     */
    public function getMetall()
    {
        return $this->metall;
    }

    /**
     * Returns the value of field table_content
     *
     * @return string
     */
    public function getTableContent()
    {
        return $this->table_content;
    }

    /**
     * Returns the value of field alwaysInTable
     *
     * @return string
     */
    public function getAlwaysintable()
    {
        return $this->alwaysInTable;
    }

    /**
     * Returns the value of field formulas
     *
     * @return string
     */
    public function getFormulas()
    {
        return $this->formulas;
    }

    /**
     * Returns the value of field created
     *
     * @return string
     */
    public function getCreated()
    {
        return $this->created;
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
     * Returns the value of field template
     *
     * @return string
     */
    public function getTemplate()
    {
        return $this->template;
    }

    /**
     * Validations and business logic
     */
    /*public function validation()
    {
        $this->validate(
            new Uniqueness(
                array(
                    'field'  => 'article',
                    'message' => 'This name already exists'
                )));
        return $this->validationHasFailed() != true;
    }*/
    /**
     * Initialize method for model.
     */
    public function initialize()
    {
        $this->hasMany('product_id', '\ProductInOrder', 'productId', array('alias' => 'ProductInOrder'));
        $this->hasMany('product_id', '\Tabs', 'product_id', array('alias' => 'Tabs'));
        $this->belongsTo('category_id', '\Categories', 'category_id', array('alias' => 'Categories'));
        $this->belongsTo('kim', '\Kim', 'kim_id', array('alias' => 'Kim'));
        $this->belongsTo('metall', '\Metalls', 'id', array('alias' => 'Metalls'));
    }

}

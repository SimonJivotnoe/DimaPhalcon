<?php


class ContentWorker
{
    public function rewriteContentAction($filename, $content )
    {
        $value = $this->rewriteContent('../public/files/' . $filename, $content);
        //$this->response->setJsonContent(array($value));

        return $value;
    }

    private function rewriteContent($filename, $content)
    {
        if (file_exists($filename)) {
            if (is_writable($filename)) {
                if ( ! $handle = fopen($filename, 'a')) {
                    return "Cannot open file ($filename)";
                    exit;
                }
                if (file_put_contents($filename, $content) === false) {
                    return "Cannot write in file ($filename)";
                    exit;
                }
                fclose($handle);
                return array(true);
            } else {
                return "File $filename is forbidden for write";
            }
        } else {
            return "File $filename not exists";
        }
    }
} 
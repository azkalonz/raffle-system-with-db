<?php

namespace App\Http\Controllers;

use App\Models\Winner;
use Exception;
use Illuminate\Http\Request;

class ExportController extends Controller
{
    function array2csv(array &$array)
    {
        if (count($array) == 0) {
            return null;
        }
        ob_start();
        $df = fopen("php://output", 'w');
        fputcsv($df, array_keys(reset($array)));
        foreach ($array as $row) {
            fputcsv($df, $row);
        }
        fclose($df);
        return ob_get_clean();
    }

    function download_send_headers($filename)
    {
        // disable caching
        $now = gmdate("D, d M Y H:i:s");
        header("Expires: Tue, 03 Jul 2001 06:00:00 GMT");
        header("Cache-Control: max-age=0, no-cache, must-revalidate, proxy-revalidate");
        header("Last-Modified: {$now} GMT");

        // force download
        header("Content-Type: application/force-download");
        header("Content-Type: application/octet-stream");
        header("Content-Type: application/download");

        // disposition / encoding on response body
        header("Content-Disposition: attachment;filename={$filename}");
        header("Content-Transfer-Encoding: binary");
    }

    public function index(Request $request)
    {
        try {
            $title = $request->title  ?? "winners";
            $this->download_send_headers("$title.csv");

            $result = [];
            $id = $request->start ?? 0;

            Winner::where("id", ">=", $id)->each(function ($winner) use (&$result) {
                if ($winner->participant->school)
                    $school = $winner->participant->school->toArray();
                $participant = $winner->participant->toArray();
                $item = $winner->item->toArray();
                array_push($result, [
                    "school" => $school['name'] ?? "N/A",
                    "name" => $participant['name'],
                    "prize" => $item['name'],
                    "amount" => $item['amount'],
                ]);
            });
            echo $this->array2csv($result);
        } catch (Exception $e) {
            die($e->getMessage());
        }
        die();
    }
}

package com.first.spark; /**
 * Created by hengwu on 4/25/17.
 */
import org.apache.spark.api.java.JavaPairRDD;
import org.apache.spark.api.java.JavaSparkContext;
import org.apache.spark.api.java.JavaRDD;
import org.apache.spark.SparkConf;
import org.apache.spark.api.java.function.FlatMapFunction;
import org.apache.spark.api.java.function.Function;
import org.apache.spark.api.java.function.Function2;
import org.apache.spark.api.java.function.PairFunction;
import scala.Tuple2;

import java.io.Serializable;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.Iterator;
import java.util.List;
import java.util.Map;

public class MapreduceTask {
    public static void main(String[] args) {
        // args[0] is team.txt
        // args[1] is champion.txt
        String master = "local[*]";
        SparkConf conf = new SparkConf()
                .setAppName(MapreduceTask.class.getName())
                .setMaster(master);
        JavaSparkContext context = new JavaSparkContext(conf);
        context.hadoopConfiguration().set("fs.s3n.awsAccessKeyId", "AKIAIBOKUOTUWUVF57QQ");
        context.hadoopConfiguration().set("fs.s3n.awsSecretAccessKey", "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");

        BanRate banRate = new BanRate();
        banRate.doTask(args[0], context);

        PurpleVsBlue purpleVsBlue = new PurpleVsBlue();
        purpleVsBlue.doTask(args[0], context);

        Champion champion = new Champion();
        champion.doTask(args[1], context);

        Factor factor = new Factor();
        factor.doTask(args[0], context);

    }

}

class BanRate implements Serializable {
    public void doTask(String input, JavaSparkContext context) {
        System.out.println("The path is : " + input);
        // String master = "local[*]";
        // SparkConf conf = new SparkConf()
        //         .setAppName(BanRate.class.getName())
        //         .setMaster(master);
        // JavaSparkContext context = new JavaSparkContext(conf);
        JavaRDD<String> words = context.textFile(input)
                .flatMap(new FlatMapFunction<String, String>() {
                    public Iterator<String> call(String s) {
                        String[] values = s.split("\t");
                        List<String> result = new ArrayList<>();
                        for (int i = 8; i < values.length; i++) {
                            result.add(values[i]);
                        }
                        return result.iterator();
                    }
                });

        JavaPairRDD<String, Integer> pair = words.mapToPair(new PairFunction<String, String, Integer>() {
            public Tuple2<String, Integer> call(String word) {
                return new Tuple2<String, Integer>(word, 1);
            }
        });

        JavaPairRDD<String, Integer> result = pair.reduceByKey(new Function2<Integer, Integer, Integer>() {
            public Integer call(Integer count1, Integer count2) {
                return count1 + count2;
            }
        });

        result.saveAsTextFile("output/output-banRate");
    }
}

class PurpleVsBlue implements Serializable {
    public void doTask(String input, JavaSparkContext context) {
        System.out.println("The path for Purple vs Blue is:" + input);
        // String master = "local[*]";
        // SparkConf conf = new SparkConf()
        //         .setAppName(PurpleVsBlue.class.getName())
        //         .setMaster(master);
        // JavaSparkContext context = new JavaSparkContext(conf);
        JavaRDD<String> words = context.textFile(input)
                .flatMap(new FlatMapFunction<String, String>() {
                    public Iterator<String> call(String s) {
                        String[] values = s.split("\t");
                        String baseCount = "0";
                        if (values[1].equals("win")) {
                            baseCount = "1";
                        }
                        return Arrays.asList(values[0] + "\t" + baseCount).iterator();
                    }
                });

        JavaPairRDD<String, String> pair = words.mapToPair(
            new PairFunction<String, String, String>() {
                public Tuple2<String, String> call(String word) {
                    String[] pair = word.split("\\t");
                    
                    return new Tuple2<String, String>(pair[0], pair[1] + "\t1");
                }
        });

        JavaPairRDD<String, String> count = pair.reduceByKey(
            new Function2<String, String, String>() {
                public String call(String count1, String count2) {
                    String[] values1 = count1.split("\\t");
                    String[] values2 = count2.split("\\t");
                    StringBuilder result = new StringBuilder();
                    result.append(Integer.parseInt(values1[0]) + Integer.parseInt(values2[0]))
                        .append("\t")
                        .append(Integer.parseInt(values1[1]) + Integer.parseInt(values2[1]));
                    return result.toString();
            }
        });

        Map<String, String> result = count.collectAsMap();
        for (String team : result.keySet()) {
            System.out.println("team: " + team + "--" + result.get(team));
        }

        count.saveAsTextFile("output/output-PurpleVsBlue");
    }
}

class Champion implements Serializable {
    public void doTask(String input, JavaSparkContext context) {
        System.out.println("The path for Champion is:" + input);
        // String master = "local[*]";
        // SparkConf conf = new SparkConf()
        //         .setAppName(Champion.class.getName())
        //         .setMaster(master);
        // JavaSparkContext context = new JavaSparkContext(conf);
        JavaRDD<String> words = context.textFile(input)
                .flatMap(new FlatMapFunction<String, String>() {
                    public Iterator<String> call(String s) {
                        String[] line = s.split("\\t");
                        String result = line[1].equals("win") ? "1" : "0";
                        String firstBlood = line[7].equals("true") ? "1" : "0";
                        String kills = line[3];
                        String KDA = line[4];
                        String quadraKills = line[5];
                        String pentaKills = line[6];

                        return Arrays.asList(line[0] + "*"
                            + result + "*"
                            + firstBlood + "*"
                            + kills + "*"
                            + KDA + "*"
                            + quadraKills + "*"
                            + pentaKills).iterator();
                    }
                });

        JavaPairRDD<String, String> pair = words.mapToPair(
            new PairFunction<String, String, String>() {
                public Tuple2<String, String> call(String word) {
                    String[] pair = word.split("\\*");
                    StringBuilder values = new StringBuilder();
                    for (int i = 1; i < pair.length; i++) {
                        values.append(pair[i] + "\t");
                    }
                    values.append("1");
                    return new Tuple2<String, String>(pair[0], values.toString());
                }
        });

        JavaPairRDD<String, String> count = pair.reduceByKey(
            new Function2<String, String, String>() {
                public String call( String count1, String count2) {
                    String[] count1Value = count1.split("\\t");
                    String[] count2Value = count2.split("\\t");
                    StringBuilder result = new StringBuilder();
                    for (int i = 0; i < count1Value.length; i++) {
                        String count = "0";
                        if (i == 3) {
                            count = Double.toString(Double.parseDouble(count1Value[i]) + Double.parseDouble(count2Value[i]));
                        }
                        else {
                            count = Integer.toString(Integer.parseInt(count1Value[i]) + Integer.parseInt(count2Value[i]));
                        }
                        result.append(count + "\t");
                    }
                    return result.substring(0, result.length() - 1);
            }
        });

        Map<String, String> result = count.collectAsMap();
        for (String team : result.keySet()) {
            System.out.println("team: " + team + "--" + result.get(team));
        }

        count.saveAsTextFile("output/output-Champion");
    }
}

class Factor implements Serializable {
    public void doTask(String input, JavaSparkContext context) {
        System.out.println("The path for Factor is:" + input);
        // String master = "local[*]";
        // SparkConf conf = new SparkConf()
        //         .setAppName(Factor.class.getName())
        //         .setMaster(master);
        // JavaSparkContext context = new JavaSparkContext(conf);
        JavaRDD<String> words = context.textFile(input)
                .flatMap(new FlatMapFunction<String, String>() {
                    public Iterator<String> call(String s) {
                        String[] line = s.split("\\t");
                        StringBuilder result = new StringBuilder();
                        result.append(line[1] + "*");
                        for (int i = 2; i <= 5; i++) {
                            int n = line[i].equals("true") ? 1 : 0;
                            result.append(n).append('*'); // delimiter to seperate different factors
                        }
                        result.append(line[6]).append('*'); // dragon kills amount
                        result.append(line[7]); // baron kills amount
                        return Arrays.asList(result.toString()).iterator();
                    }
                });

        JavaPairRDD<String, String> pair = words.mapToPair(
            new PairFunction<String, String, String>() {
                public Tuple2<String, String> call(String word) {
                    String[] pair = word.split("\\*");
                    StringBuilder values = new StringBuilder();
                    for (int i = 1; i < pair.length; i++) {
                        values.append(pair[i] + "\t");
                    }
                    values.append("1");
                    return new Tuple2<String, String>(pair[0], values.toString());
                }
        });

        JavaPairRDD<String, String> count = pair.reduceByKey(
            new Function2<String, String, String>() {
                public String call( String count1, String count2) {
                    String[] count1Value = count1.split("\\t");
                    String[] count2Value = count2.split("\\t");
                    StringBuilder result = new StringBuilder();
                    for (int i = 0; i < count1Value.length; i++) {
                        String count = Integer.toString(Integer.parseInt(count1Value[i]) + Integer.parseInt(count2Value[i]));
                        result.append(count + "\t");
                    }
                    return result.substring(0, result.length() - 1);
            }
        });

        Map<String, String> result = count.collectAsMap();
        for (String team : result.keySet()) {
            System.out.println("team: " + team + "--" + result.get(team));
        }

        count.saveAsTextFile("output/output-factor");
    }
}


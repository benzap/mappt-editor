(defproject mappt "0.1.0-SNAPSHOT"
  :description "Map Application to get from point A to point B"
  :source-paths ["src-clj"]
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2197"
                  :exclusions [org.apache.ant/ant]]
                 [compojure "1.1.8"]
                 [hiccup "1.0.5"]
                 [garden "1.2.1"]
                 [secretary "1.2.0"]
                 [prone "0.4.0"]]
  :plugins [[lein-cljsbuild "1.0.3"]
            [lein-ring "0.8.11"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds {:dev
                       {:source-paths ["src-cljs"]
                        :compiler {:output-to "resources/public/js/main.js"
                                   :optimizations :whitespace
                                   :pretty-print true}}
                       :prod
                       {:source-paths ["src-cljs"]
                        :compiler {:output-to "resources/public/js/main.min.js"
                                   :optimizations :advanced
                                   :pretty-print false}}}}
  :ring {:handler mappt.server.routes/app})

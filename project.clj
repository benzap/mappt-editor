(defproject mappt "0.1.0-SNAPSHOT"
  :description "Map Application to get from point A to point B"
  :source-paths ["src-clj"]
  :url "http://example.com/FIXME"
  :license {:name "Eclipse Public License"
            :url "http://www.eclipse.org/legal/epl-v10.html"}
  :dependencies [[org.clojure/clojure "1.6.0"]
                 [org.clojure/clojurescript "0.0-2173"
                  :exclusions [org.apache.ant/ant]]
                 [compojure "1.1.8"]
                 [hiccup "1.0.5"]
                 [garden "1.2.1"]
                 [secretary "1.2.0"]
                 [prone "0.4.0"]
                 [om "0.7.1"]
                 [sablono "0.2.22"]
                 [org.clojure/core.async "0.1.338.0-5c5012-alpha"]]
  :plugins [[lein-cljsbuild "1.0.2"]
            [lein-ring "0.8.11"]
            [lein-garden "0.2.1"]]
  :hooks [leiningen.cljsbuild]
  :cljsbuild {:builds {:dev
                       {:source-paths ["src-cljs"]
                        :compiler {:output-to "resources/public/js/main.js"
                                   :optimizations :whitespace
                                   :pretty-print true
                                   :preamble ["react/react.min.js"]
                                   :externs ["react/externs/react.js"]}}
                       :prod
                       {:source-paths ["src-cljs"]
                        :compiler {:output-to "resources/public/js/main.min.js"
                                   :optimizations :advanced
                                   :pretty-print false}}}}
  :garden {:builds [{:id "main"
                     :stylesheet mappt.server.styles/main
                     :compiler {:output-to "resources/public/css/main.css"
                                :pretty-print? false}}]}
  :ring {:handler mappt.server.routes/app})

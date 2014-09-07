(ns mappt.server.styles
  "Compiled Stylesheets to 'main.css'"
  (:require [garden.def :refer [defstylesheet defstyles]]
            [garden.units :refer [px]]
            [garden.color :as color :refer [rgb rgba]]))

(def default-colors {:blue (rgb 17 63 140) ;;#113f8c
                     :cyan (rgb 1 164 164) ;;#01a4a4
                     :baby-blue (rgb 0 161 203) ;;#00A1CB
                     :lime-green (rgb 97 174 36) ;;#61AE24
                     :yellow (rgb 208 209 2) ;;#D0D102
                     :forest-green (rgb 50 116 44) ;;#32742C
                     :magenta (rgb 215 0 96) ;;#D70060
                     :cherry (rgb 229 64 40) ;;#E54028
                     :orange (rgb 241 141 5) ;;#F18D05
                     :grey (rgb 97 97 97) ;;#616161
                     :offwhite (rgb 240 240 245)
                     :black (rgb 13 13 13)})

(def panel-style {:color (default-colors :offwhite)
                  :background-color (default-colors :grey)})

(def header-style (merge
                   panel-style
                   {:position :absolute
                    :top 0
                    :right 0
                    :left 0
                    :width "100%"
                    :height (px 40)}))

(def sidebar-style {:position :absolute
                    :top (header-style :height)
                    :bottom 0
                    :left 0
                    :width (px 200)
                    :background-color
                    (color/darken (default-colors :offwhite) 10)
                    :color (default-colors :offwhite)
                    :border-right-width (px 4)
                    :border-right-style :solid
                    :border-right-color
                    (color/darken (default-colors :offwhite) 20)
                    :border-bottom-width (px 4)
                    :border-bottom-style :solid
                    :border-bottom-color
                    (color/darken (default-colors :offwhite) 20)})

(def content-style {:position :absolute
                    :top (header-style :height)
                    :right 0
                    :bottom 0
                    :left (sidebar-style :width)
                    :color (default-colors :black)
                    :background-color (default-colors :offwhite)})

(def button-style
  {:padding (px 5)
   :margin (px 5)
   :border-width (px 1)
   :border-style :solid
   :border-color (color/lighten (default-colors :lime-green) 10)
   :border-radius (px 4)
   :background-color (default-colors :lime-green)
   :color (default-colors :offwhite)})

(defstyles main
  [:*
   {:margin 0
    :padding 0
    :box-sizing :border-box}]
  [:body
   {:position :absolute
    :top 0 :right 0 :bottom 0 :left 0}]
  [:.main-container
   {:position :relative
    :width "100%"
    :height "100%"}]
  [:.content content-style]
  [:.header header-style]
  [:.header-left
   {:position :relative
    :height (header-style :height)
    :width (sidebar-style :width)
    :background-color
    (color/lighten (header-style :background-color) 10)}]
  [:.header-breadcrumb
   {:position :absolute
    :padding (px 10)
    :height (header-style :height)
    :top 0
    :left (sidebar-style :width)}]
  [:.header-right
   {:position :absolute
    :height (header-style :height)
    :top 0
    :right 0}]
  [:.header [:.mappt-logo {:padding (px 10)
                           :font-size (px 28)}]]
  [:.sidebar sidebar-style]
  [:.button
   (merge
    button-style
    {:height (px 30)
     :width (px 150)})]
  [:.button-icon
   (merge
    button-style
    {:height (px 30)
     :width (px 30)})])

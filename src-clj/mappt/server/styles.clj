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
                     :offwhite (rgb 253 253 253)
                     :black (rgb 13 13 13)})

(def default-fonts
  {:inconsolata "'Inconsolata', "
   :righteous "'Righteous', cursive"
   :roboto "'Roboto Slab', serif"})

(def panel-style {:color (default-colors :offwhite)
                  :background-color (default-colors :grey)})

(def header-style (merge
                   panel-style
                   {:position :absolute
                    :top 0
                    :right 0
                    :left 0
                    :height (px 40)}))

(def sidebar-style {:position :absolute
                    :top (header-style :height)
                    :bottom 0
                    :left 0
                    :width (px 200)
                    :background-color
                    (color/darken (default-colors :offwhite) 10)
                    :color (default-colors :orange)
                    :letter-spacing (px 1.5)
                    })

(def sidebar-element-style
  (merge
   panel-style
   {:position :relative
    :color (default-colors :orange)
    :background-color
    (color/lighten (panel-style :background-color) 5)
    :padding-top (px 5)
    :padding-right (px 10)
    :padding-bottom (px 5)
    :padding-left (px 10)
    :font-family (default-fonts :roboto)
    :font-weight :bold
    :font-size (px 18)
    :cursor :pointer
    :border-bottom-style :solid
    :border-bottom-width (px 1)
    :border-bottom-color
    (color/lighten (panel-style :background-color) 30)}))

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
   :color (default-colors :offwhite)
   :user-select :none
   :outline :none
   :-webkit-touch-callout :none
   :-webkit-user-select :none
   :-khtml-user-select :none
   :-moz-user-select :none
   :-ms-user-select :none})

(def button-hover-style
  {:background-color
   (color/lighten (button-style :background-color) 10)
   :cursor :pointer})

(def button-active-style
  {:background-color
   (color/darken (button-style :background-color) 10)})



(def breadcrumb-style
  {:background-color
   (color/darken (header-style :background-color) 10)
   :padding-top (px 5)
   :padding-right (px 10)
   :padding-bottom (px 5)
   :padding-left (px 10)})

(def link-style
  {:color (default-colors :baby-blue)
   :text-decoration :none})

(def modal-style
  {:position :relative
   :margin :auto
   :top (px 30)
   :width (px 500)
   :max-height "80%"
   :z-index 999
   :background-color :white
   :border-width (px 1)
   :border-style :solid
   :border-color :black
   :border-radius (px 7)
   :box-shadow "0px -3px 9px 2px rgba(50, 50, 50, 0.25)"
   :overflow :hidden})

(def input-text-style
  {:border-radius (px 3)})

(defstylesheet main 
  {:output-to "resources/public/css/main.css"}
  [:*
   {:margin 0
    :padding 0
    :box-sizing :border-box
    :font-family "Arial, Helvetica, sans-serif"}]
  [:a link-style
   [:&:hover
    {:color (color/lighten (link-style :color) 20)
     :cursor :pointer}]]
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
    (color/lighten (header-style :background-color) 10)
    :border-bottom-style :solid
    :border-bottom-width (px 1)
    :border-bottom-color
    (color/lighten (panel-style :background-color) 30)}]
  [:.header-breadcrumb
   {:position :absolute
    :padding (px 7)
    :height (header-style :height)
    :top 0
    :left (sidebar-style :width)}]
  [:.header-right
   {:position :absolute
    :height (header-style :height)
    :top 0
    :right 0}]
  [:.header [:.mappt-logo {:padding (px 10)
                           :font-family (default-fonts :righteous)
                           :font-size (px 28)}]]
  [:.breadcrumb breadcrumb-style
   [:&:first-child
    {:border-top-left-radius (px 4)
     :border-bottom-left-radius (px 4)}]
   [:&:last-child
    {:border-top-right-radius (px 4)
     :border-bottom-right-radius (px 4)}]]
  [:.breadcrumb-tree
   {:margin (px 5)}]
  [:.breadcrumb-separator
   (merge breadcrumb-style
          {:border-left-width (px 2)
           :border-left-style :solid
           :border-left-color (rgba 255 255 255 0.1)
           :border-right-width (px 2)
           :border-right-style :solid
           :border-right-color (rgba 255 255 255 0.1)})]
  [:.sidebar sidebar-style]
  [:.sidebar-element sidebar-element-style
   [:&:hover
    {:background-color
     (color/darken (sidebar-element-style :background-color) 30)}]]
  [:.sidebar-element.selected
   (merge
    sidebar-element-style
    {:background-color
     (color/darken (sidebar-element-style :background-color) 40)
     :border-right-width (px 5)
     :border-right-style :solid
     :border-right-color (default-colors :orange)})]
  [:.sidebar-icon
   {:position :absolute
    :padding (px 4)
    :margin-right (px 5)
    :top 0
    :right 0
    :bottom 0}]
  [:.button
   (merge
    button-style
    {:height (px 25)
     :width (px 150)})
   [:&:hover
    button-hover-style]
   [:&:active
    button-active-style]]
  [:.button-icon
   (merge
    button-style
    {:height (px 25)
     :width (px 25)})
   [:&:hover
    button-hover-style]
   [:&:active
    button-active-style]]
  [:.modal modal-style]
  [:.modal-shade
   {:background-color (rgba 27 27 27 0.7)
    :box-shadow "0 1px 5px rgba(0, 0, 0, 0.25)"
    :position :absolute
    :z-index (dec (:z-index modal-style))
    :top 0
    :right 0
    :bottom 0
    :left 0
    :display :none}]
  [:#modal-header
   {:position :relative
    :width "100%"
    :height (px 40)
    :background-color (default-colors :grey)}]
  [:#modal-content
   {:position :relative
    :overflow-scrolling :auto}]
  [:#modal-sign-in
   {:text-align :right
    :margin-top (px 20)
    :margin-right (px 80)
    :margin-bottom (px 20)
    :margin-left (px 20)
    :overflow-scrolling :inherit}]
  [:#modal-register
   {:text-align :right
    :margin-top (px 20)
    :margin-right (px 75)
    :margin-bottom (px 20)
    :margin-left (px 20)}]
  [:.input-text
   {:border-radius (px 5)
    :padding (px 5)
    :font-size (px 18)}])


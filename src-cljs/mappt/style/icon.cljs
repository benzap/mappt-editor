(ns mappt.style.icon)

(defn gen-icon [name size & [right bottom]]
  [:i {:class (str "icon-" name)
       :style
       #js {
            :fontSize (str size "px")
            :position "relative"
            :right (str (or right 0) "px")
            :bottom (str (or bottom 0) "px")
            }}])

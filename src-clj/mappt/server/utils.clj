(ns mappt.server.utils)

(defn generate-api-response [data session]
  {:status 200
   :headers {"Content-Type" "application/edn"}
   :body (pr-str data)
   :session session})

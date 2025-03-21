{-# LANGUAGE OverloadedStrings #-}
module Main
    ( main
    ) where


--------------------------------------------------------------------------------
import           Control.Concurrent  (forkIO)
import           Control.Monad       (forever, unless, forM)
import           Control.Monad.Trans (liftIO)
import           Network.Socket      (withSocketsDo)
import           Data.Text           (Text)
import qualified Data.Text           as T
import qualified Data.Text.IO        as T
import qualified Network.WebSockets  as WS
import           System.Environment  (getArgs)
import           Text.Read           (readMaybe)

--------------------------------------------------------------------------------

-- faire une fonction pour demander le potrt en argument (si jamais)


--------------------------------------------------------------------------------
app :: WS.ClientApp ()
app conn = do
    putStrLn "Connected!"

    -- read input file content 
    inputText <- T.readFile "input.txt"
    let inputLines = T.lines inputText

    -- communication with reflector
    fullResponse <- forM inputLines $ \line -> do 
        WS.sendTextData conn line 
        putStrLn $ "Sent to reflector : " <> T.unpack line 
        response <- WS.receiveData conn 
        putStrLn $ "Received from reflector : " <> T.unpack response
        return response  

    -- write in an output file
    T.writeFile "output.txt" (T.unlines fullResponse)
    putStrLn "Response savec to output.txt"


--------------------------------------------------------------------------------
main :: IO ()
main = withSocketsDo $ do 
    -- args <- getArgs
    -- let port = case args of 
    --     [portStr] -> case readMaybe portStr of 
    --                     Just p -> p 
    --                     Nothing -> 3000
    --     _         -> 3000 
    -- in
    putStrLn $ "Connecting to reflector on port 3000" -- <> show port  
    WS.runClient "127.0.0.1" 3000 "/" app



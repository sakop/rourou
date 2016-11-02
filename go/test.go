package main

import (
	"fmt"
	"os"
	"bufio"
)

func main() {
	countMap := make(map[string]int)
	if len(os.Args) < 1 {
		stats(os.Stdin, countMap)
	} else {
		for _, filename := range os.Args[1:] {
			file, err := os.Open(filename)
			if err != nil {
				fmt.Fprintf(os.Stderr, "Error occurred when opening %s:%v\n", filename, err)
				continue
			}
			stats(file,countMap)
			file.Close()
		}
	}

	for key, value := range countMap {
		if value > 1 {
			fmt.Printf("%s occurred %d times\n", key, value)
		}
	}
}

func stats(f *os.File, countMap map[string]int) {
	scanner := bufio.NewScanner(f)
	for scanner.Scan() {
		countMap[scanner.Text()]++
	}
}
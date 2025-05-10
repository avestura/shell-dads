package main

import (
	"fmt"
	"math/rand"
	"os"

	dads "github.com/avestura/shell-dads/dads"
)

func printCreditNotice() {
	fmt.Println("\033[3;90mDictionary of Algorithms and Data Structures, Vadim Okun, ed.,\033[0m")
	fmt.Println("\033[3;90mhttps://www.nist.gov/dads/, (11 May 2025).\033[0m")
}

func getRandomKey() string {
	keys := make([]string, 0, len(dads.Terms))
	for k := range dads.Terms {
		keys = append(keys, k)
	}
	return keys[rand.Intn(len(keys))]
}

func printRandomTip() {
	randKey := getRandomKey()
	randItem := dads.Terms[randKey]
	os.Setenv("X_SHELL_DADS_CURRENT_KEY", randItem.Text)
	aka := ""
	if randItem.AlsoKnownAs != "" {
		aka = fmt.Sprintf(" (aka %s)", randItem.AlsoKnownAs)
	}
	fmt.Printf("\033[1;34m%s%s\033[0m", randItem.Text, aka)
	fmt.Println()
	fmt.Println(randItem.Definition)
	fmt.Println()
	printCreditNotice()
}

func showHelp() {
	fmt.Println("available commands: tip")
}

func main() {
	if len(os.Args) > 1 {
		args := os.Args[1:]
		if args[0] == "tip" {
			printRandomTip()
		} else {
			showHelp()
		}
	} else {
		showHelp()
	}
}

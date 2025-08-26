export const randomResponses = [
  `That’s a really good question! Let’s take a Python example.  
Imagine you want to reverse a string. The basics start with slicing, but we can also write a function for clarity:  

\`\`\`python
def reverse_string(text: str) -> str:
    # Python allows slicing with [::-1] to reverse
    return text[::-1]

if __name__ == "__main__":
    sample = "Hello World"
    print("Original:", sample)
    print("Reversed:", reverse_string(sample))
\`\`\`

This is simple but shows the power of Python’s slicing.  
Would you like me to expand it to handle lists or numbers too?`,

  `I see what you mean! Let’s think in Java.  
Suppose you want to check if a number is a **prime number**.  
Here’s a complete Java program:  

\`\`\`java
public class PrimeCheck {
    public static boolean isPrime(int n) {
        if (n <= 1) return false;
        for (int i = 2; i <= Math.sqrt(n); i++) {
            if (n % i == 0) return false;
        }
        return true;
    }

    public static void main(String[] args) {
        int number = 29;
        if (isPrime(number)) {
            System.out.println(number + " is a prime number.");
        } else {
            System.out.println(number + " is not a prime number.");
        }
    }
}
\`\`\`

This program checks divisibility efficiently using the square root optimization.  
Want me to also show how to accept user input in this?`,

  `Great point! Let’s see how JavaScript can solve something like **fibonacci sequence** generation.  

\`\`\`javascript
// Generate Fibonacci sequence up to 'n' terms
function fibonacci(n) {
  let seq = [0, 1];
  for (let i = 2; i < n; i++) {
    seq.push(seq[i - 1] + seq[i - 2]);
  }
  return seq;
}

// Example usage
console.log("First 10 Fibonacci numbers:", fibonacci(10));
\`\`\`

JavaScript’s dynamic arrays make this super easy.  
If needed, we can optimize it using memoization or recursion with caching.`,

  `
 Fix the Route Definition in App.jsx
Ensure the nested route is defined correctly. The parent route (/services) should render the Services component, and the child route (/:id) should render the SubServicesPage component.

Update App.jsx:


\`\`\`jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Services from "./Services";
import SubServicesPage from "./SubServicesPage";

function App() {
  return (
    <Router>
      <Routes>
        {/* Parent route for Services */}
        <Route path="/services" element={<Services />}>
          {/* Nested route for SubServicesPage */}
          <Route path=":id" element={<SubServicesPage />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
\`\`\`
`,
];
